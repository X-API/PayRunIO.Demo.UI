module.exports = {
    "Query": {
        "RootNodeName": "NextPayRunDates",
        "Variables": {
            "Variable": [
                {
                    "@Name": "[EmployerKey]", "@Value": "$$EmployerKey$$"
                },
                { "@Name": "[PayScheduleKey]", "@Value": "$$PayScheduleKey$$" }]
        },
        "Groups": {
            "Group": [
                {
                    "@Selector": "/Employer/[EmployerKey]/PaySchedule/[PayScheduleKey]/PayRuns",
                    "Filter": [
                        {
                            "@xsi:type": "TakeFirst",
                            "@Value": "1"
                        }
                    ],
                    "Output": [
                        {
                            "@xsi:type": "RenderValue",
                            "@Name": "PaySchedule",
                            "@Value": "[PayScheduleKey]"
                        },
                        {
                            "@xsi:type": "RenderProperty",
                            "@Output": "Variable",
                            "@Name": "[PayFrequency]",
                            "@Property": "PayFrequency"
                        },
                        {
                            "@xsi:type": "Max",
                            "@Output": "Variable",
                            "@Name": "[LastPayDay]",
                            "@Property": "PaymentDate",
                            "@Format": "yyyy-MM-dd"
                        },
                        {
                            "@xsi:type": "Max",
                            "@Output": "Variable",
                            "@Name": "[LastPeriodStart]",
                            "@Property": "PeriodStart",
                            "@Format": "yyyy-MM-dd"
                        },
                        {
                            "@xsi:type": "Max",
                            "@Output": "Variable",
                            "@Name": "[LastPeriodEnd]",
                            "@Property": "PeriodEnd",
                            "@Format": "yyyy-MM-dd"
                        },
                        {
                            "@xsi:type": "RenderNextDate",
                            "@Name": "NextPayDay",
                            "@Date": "[LastPayDay]",
                            "@PayFrequency": "[PayFrequency]",
                            "@Format": "yyyy-MM-dd"
                        },
                        {
                            "@xsi:type": "RenderNextDate",
                            "@Name": "NextPeriodStart",
                            "@Date": "[LastPeriodStart]",
                            "@PayFrequency": "[PayFrequency]",
                            "@Format": "yyyy-MM-dd"
                        },
                        {
                            "@xsi:type": "RenderNextDate",
                            "@Name": "NextPeriodEnd",
                            "@Date": "[LastPeriodEnd]",
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
                }
            ]
        }
    }
};
