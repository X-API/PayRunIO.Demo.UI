module.exports = {
    "Query": {
        "RootNodeName": "MinStartQuery",
        "Variables": {
            "Variable": [
                {
                    "@Name": "[EmployerKey]",
                    "@Value": "$$EmployerKey$$"
                },
                {
                    "@Name": "[EmployeeKey]",
                    "@Value": "$$EmployeeKey$$"
                }
            ]
        },
        "Groups": {
            "Group": [
                {
                    "@Selector": "/Employer/[EmployerKey]/Employee/[EmployeeKey]/PayRuns",
                    "Filter": [
                        {
                            "@xsi:type": "TakeFirst",
                            "@Value": "1"
                        }
                    ],
                    "Output": [
                    	{
                            "@xsi:type": "RenderValue",
                            "@Name": "EmployeeKey",
                            "@Value": "[EmployeeKey]"
                        },
                        {
                            "@xsi:type": "Max",
                            "@Name": "LastPayDay",
                            "@Property": "PaymentDate",
                            "@Format": "yyyy-MM-dd"
                        }
                    ],
                    "Order": [
                        {
                            "@xsi:type": "Descending",
                            "@Property": "PaymentDate"
                        }
                    ]
                },
            ]
        }
    }
};