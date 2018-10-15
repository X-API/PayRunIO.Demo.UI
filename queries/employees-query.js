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
                            "@Name": "Key",
                            "@Value": "[EmployeeKey]"
                        },
                        {
                            "@xsi:type": "RenderProperty",
                            "@Name": "Title",
                            "@Property": "Title"
                        },
                        {
                            "@xsi:type": "RenderProperty",
                            "@Name": "Firstname",
                            "@Property": "FirstName"
                        },
                        {
                            "@xsi:type": "RenderProperty",
                            "@Name": "Lastname",
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