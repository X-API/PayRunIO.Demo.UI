module.exports = class BaseInstruction {
    get name() {
        throw Error("get name() needs implementing against each instruction");
    }

    async extendViewModel(ctx, vm) {
        // override this to extend the passed in view model with instruction type specific properties. 
        vm.Name = this.name;

        return vm;
    }

    parseForApi(body) {
        let copy = JSON.parse(JSON.stringify(body));

        // clear out utility properties as otherwise the api will return an error as they are unexpected.
        copy.MinStartDate = null;
        copy.InstructionType = null;
        copy.EmployerId = null;

        // reorder properties so we always have the StartDate, EndDate and Description at the beginning of the 
        // list, as required by the api. 
        return Object.assign({
            StartDate: copy.StartDate,
            EndDate: copy.EndDate,
            Description: copy.Description
        }, copy);
    }
};