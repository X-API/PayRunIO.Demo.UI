module.exports = {
    "Query": {
        "RootNodeName": "EmployerTable",
        "Groups": {
            "Group": [
                {
                    "@ItemName": "Employer",
                    "@Selector": "/Employers/",
                    "@UniqueKeyVariable": "[EmployerKey]",
                    "Output": [
                        {
                            "@xsi:type": "RenderArrayHint"
                        },
                        {
                            "@xsi:type": "RenderValue",
                            "@Name": "Key",
                            "@Value": "[EmployerKey]"
                        },
                        {
                            "@xsi:type": "RenderProperty",
                            "@Name": "Name",
                            "@Property": "Name"
                        },
                        {
                            "@xsi:type": "RenderProperty",
                            "@Name": "TaxOfficeNumber",
                            "@Property": "HmrcSettings.TaxOfficeNumber"
                        },
                        {
                            "@xsi:type": "RenderProperty",
                            "@Name": "TaxOfficeReference",
                            "@Property": "HmrcSettings.TaxOfficeReference"
                        }
                    ],
                    "Group": [
                    	{
	                    	"@ItemName": "Revisions",
	                        "@Selector": "/Employer/[EmployerKey]/Revisions",
	                        "Output": [
	                          { 
								"@xsi:type": "RenderProperty",
                                "@Name": "Revision",
                                "@Property": "Revision"
							  },
							  { 
								"@xsi:type": "RenderProperty",
                                "@Name": "EffectiveDate",
                                "@Property": "EffectiveDate",
                                "@Format": "yyyy-MM-dd"
							  }
	                        ],
                            "Order": [
                                {
                                    "@xsi:type": "Descending",
                                    "@Property": "Revision"
                                }
                            ]
                    	},
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
            ]
        }
    }
};