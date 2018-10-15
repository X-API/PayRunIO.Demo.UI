module.exports = {
    "Query": {
        "RootNodeName": "EmployeesTable",
        "Groups": {
            "Group": [
                {
                    "@ItemName": "Employees",
                    "@Selector": "/Employer/$$EmployerKey$$/Employees",
                    "@UniqueKeyVariable": "[EmployeeKey]",
                    "Output": [
                        {
                            "@xsi:type": "RenderArrayHint"
                        },
                        {
                            "@xsi:type": "RenderValue",
                            "@Name": "Id",
                            "@Value": "[EmployeeKey]"
                        },
                        {
                            "@xsi:type": "RenderProperty",
                            "@Name": "Title",
                            "@Property": "Title"
                        },
                        {
                            "@xsi:type": "RenderProperty",
                            "@Name": "FirstName",
                            "@Property": "FirstName"
                        },
                        {
                            "@xsi:type": "RenderProperty",
                            "@Name": "LastName",
                            "@Property": "LastName"
                        },
                        {
                            "@xsi:type": "RenderProperty",
                            "@Name": "Initials",
                            "@Property": "Initials"
                        },
                        {
                            "@xsi:type": "RenderProperty",
                            "@Name": "Code",
                            "@Property": "Code"
                        }
                    ]
                }
            ]
        }
    }
};