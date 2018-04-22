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
                        	"@Output": "Variable",
                            "@Name": "[PayFrequency]",
                            "@Property": "PayFrequency"
                        },
                        {
                            "@xsi:type": "RenderValue",
                            "@Name": "PayFrequency",
                            "@Value": "[PayFrequency]"
                        }
                    ],
                    "Group": [
                    	{
	                        "@Selector": "/Employer/[EmployerKey]/Employees",
	                        "Filter": [
                                {
	                        		"@xsi:type": "IsNotNull",
	                            	"@Property": "PaySchedule"
	                        	},
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
                            "Filter": [
                                {
                                    "@xsi:type": "TakeFirst",
                                    "@Value": "1"
                                }
                            ],
                            "Output": [
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
                                    "@Name": "[HeadSequence]",
                                    "@Property": "Sequence"
                                },
                                {
                                    "@xsi:type": "RenderValue",
			                        "@Name": "LastPayDay",
			                        "@Value": "[LastPayDay]"
                                },
                                {
                                    "@xsi:type": "RenderNextDate",
                                    "@Name": "NextPayDay",
                                    "@Date": "[LastPayDay]",
                                    "@PayFrequency": "[PayFrequency]",
                                    "@Format": "yyyy-MM-dd"
                                },
                                {
                                    "@xsi:type": "RenderValue",
			                        "@Name": "HeadSequence",
			                        "@Value": "[HeadSequence]"
                                }
                            ],
                            "Order": [
                                {
                                    "@xsi:type": "Descending",
                                    "@Property": "PaymentDate"
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
                                    "@Property": "PaymentDate",
                                    "@Format": "yyyy-MM-dd"
                                },
                                {
                                    "@xsi:type": "RenderProperty",
                                    "@Name": "PeriodStart",
                                    "@Format": "yyyy-MM-dd",
                                    "@Property": "PeriodStart"
                                },
                                {
                                    "@xsi:type": "RenderProperty",
                                    "@Name": "PeriodEnd",
                                    "@Format": "yyyy-MM-dd",
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
