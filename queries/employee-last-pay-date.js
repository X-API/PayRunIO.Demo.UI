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
                },
                {
                    "@Name": "[PayScheduleKey]",
                    "@Value": "$$PayScheduleKey$$"
                }
            ]
        },

        "Groups": {
            "Group": [
                {
                    "@Selector": "/Employer/[EmployerKey]/PaySchedule/[PayScheduleKey]",
                    "Output": [
                    	{
                            "@xsi:type": "RenderProperty",
                            "@Output": "Variable",
                            "@Property": "PayFrequency",
                            "@Name": "[PayFrequency]"
                        }
                    ],
                },
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
                            "@Output": "Variable",
                            "@Name": "[LastPayDay]",
                            "@Property": "PaymentDate",
                            "@Format": "yyyy-MM-dd"
                        },
                        {
                            "@xsi:type": "RenderValue",
                            "@Name": "LastPayDay",
                            "@Value": "[LastPayDay]"
                        },
                        {
                            "@xsi:type": "Max",
                            "@Output": "Variable",
                            "@Name": "[LastPeriodStart]",
                            "@Property": "PeriodStart",
                            "@Format": "yyyy-MM-dd"
                        },
                        {
                            "@xsi:type": "RenderNextDate",
                            "@Name": "NextPeriodStart",
                            "@Date": "[LastPeriodStart]",
                            "@PayFrequency": "[PayFrequency]",
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