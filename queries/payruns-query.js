module.exports = {
    "Query": {
        "Variables": { "Variable": [{ "@Name": "[EmployerKey]", "@Value": "$$EmployerKey$$" }] },
        "RootNodeName": "PayRunsQuery",
        "Groups": {
            "Group": [
                {
                    "@Selector": "/Employer/[EmployerKey]/PaySchedules",
                    "@UniqueKeyVariable": "[PayScheduleKey]",
                    "Output": [
                        {
                            "@xsi:type": "RenderProperty",
                            "@Output": "Variable",
                            "@Name": "[PayFrequency]",
                            "@Property": "PayFrequency"
                        },
                        {
                            "@xsi:type": "RenderProperty",
                            "@Output": "Variable",
                            "@Name": "[Name]",
                            "@Property": "Name"
                        }
                    ],
                    "Group": [
                        {
                            "@ItemName": "PayRuns",
                            "@Selector": "/Employer/[EmployerKey]/PaySchedule/[PayScheduleKey]/PayRuns",
                            "@UniqueKeyVariable": "[PayRunKey]",
                            "Output": [
                                {
                                    "@xsi:type": "RenderArrayHint"
                                },
                                {
                                    "@xsi:type": "RenderValue",
                                    "@Name": "PayRunKey",
                                    "@Value": "[PayRunKey]"
                                },
                                {
                                    "@xsi:type": "RenderValue",
                                    "@Name": "PayScheduleKey",
                                    "@Value": "[PayScheduleKey]"
                                },
                                {
                                    "@xsi:type": "RenderProperty",
                                    "@Name": "PaymentDate",
                                    "@Property": "PaymentDate",
                                    "@Format": "yyyy-MM-dd"
                                },
                                {
                                    "@xsi:type": "RenderValue",
                                    "@Name": "PaySchedule",
                                    "@Value": "[Name]"
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
            ]
        }
    }
};
