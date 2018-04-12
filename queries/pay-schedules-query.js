module.exports = {
    "Query": {
        "Variables": { "Variable": [{"@Name": "[EmployerKey]", "@Value": "$$EmployerKey$$"}] },
        "RootNodeName": "PaySchedulesTable",
        "Groups": {
            "Group": [
                {
                    "@ItemName": "PaySchedule",
                    "@Selector": "/Employer/[EmployerKey]/PaySchedules",
                    "@UniqueKeyVariable": "[PayScheduleKey]",
                    "Output": [
                        {
                            "@xsi:type": "RenderArrayHint"
                        },
                        {
                            "@xsi:type": "RenderValue",
                            "@Name": "Key",
                            "@Value": "[PayScheduleKey]"
                        },
                        {
                            "@xsi:type": "RenderProperty",
                            "@Name": "Name",
                            "@Property": "Name"
                        },
                        {
                            "@xsi:type": "RenderProperty",
                            "@Name": "PayFrequency",
                            "@Property": "PayFrequency"
                        }
                    ],
                    "Group": [
                    {
                        "@Selector": "/Employer/[EmployerKey]/Employees",
                        "Filter": [
                            {
                            "@xsi:type": "EndsWith",
                            "@Property": "PaySchedule.Href",
                            "@Value": "[PayScheduleKey]"
                            }
                        ],
                        "Output": [
                            { 
                            "@xsi:type": "Count", 
                            "@Name": "EmployeeCount"
                            }
                        ]
                        },
                        {
                            "@Selector": "/Employer/[EmployerKey]/PaySchedule/[PayScheduleKey]/PayRuns",
                            "Output": [
                                {
                                    "@xsi:type": "Max",
                                    "@Name": "LastPayDay",
                                    "@Property": "PaymentDate",
                                    "@Format": "yyyy-MM-dd"
                                },
                                {
                                    "@xsi:type": "Max",
                                    "@Name": "HeadSequence",
                                    "@Property": "Sequence"
                                }
                            ]
                        },
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
		                            "@Name": "Key",
		                            "@Value": "[PayRunKey]"
		                        },
                                {
                                    "@xsi:type": "RenderProperty",
                                    "@Name": "PaymentDate",
                                    "@Property": "PaymentDate"
                                },
                                {
                                    "@xsi:type": "RenderProperty",
                                    "@Name": "PeriodStart",
                                    "@Property": "PeriodStart"
                                },
                                {
                                    "@xsi:type": "RenderProperty",
                                    "@Name": "PeriodEnd",
                                    "@Property": "PeriodEnd"
                                },
                                {
                                    "@xsi:type": "RenderProperty",
                                    "@Name": "TaxYear",
                                    "@Property": "TaxYear"
                                },
                                {
                                    "@xsi:type": "RenderProperty",
                                    "@Name": "TaxPeriod",
                                    "@Property": "TaxPeriod"
                                },
                                {
                                    "@xsi:type": "RenderProperty",
                                    "@Name": "Sequence",
                                    "@Property": "Sequence"
                                },
                                {
                                    "@xsi:type": "RenderProperty",
                                    "@Name": "IsSupplementary",
                                    "@Property": "IsSupplementary"
                                }
                            ],
                            "Order": [
                                {
                                    "@xsi:type": "Ascending",
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
