# Pay instructions

To support an additional pay instruction.

1. In `views/employee.hbs`, add a new dropdown item for your desired pay instruction. It should link to `/employer/{{EmployerId}}/employee/{{Id}}/payInstruction/new?type={Type}` with `{Type}` being the [PayInstruction class name](http://developer.payrun.io/docs/reference/pay-instruction/index.html). For example `P45PayInstruction`, this is case sensitive.

2. Add a new service to `services/payInstructions` with the name of the pay instruction, this is again case sensitive. All new pay instructions should inherit from `BaseInstruction` and implement `canInstructionsOverlap()`. An example is:

```
const BaseInstruction = require("./BaseInstruction");

module.exports = class SalaryPayInstruction extends BaseInstruction {
    get canInstructionsOverlap() {
        return false;
    }

    parseForApi(body) {
        let parsedBody = super.parseForApi(body);

        // do any additional parsing here. 

        return parsedBody;
    }
};
```

If instructions need to be sequential ([more information on this can be found here](http://developer.payrun.io/docs/how-to/setting-the-employee-salary.html)), then return `false`, otherwise, if they can overlap, return `true`. 

`parseForApi` can be overridden, if overridding make sure to call into `super.parseForApi` with the passed in `body` to do the default parsing for all instructions. 

3. Implement the custom view, containing the properties required for the instruction. This should go in `views/partials/payInstructions` and should be the name of the type, again it's case sensitive. For instructions that need to be sequential you can use the Handlebars helper:

```
{{minStartDate MinStartDate}}
```

Which can go on the Start date date field. 