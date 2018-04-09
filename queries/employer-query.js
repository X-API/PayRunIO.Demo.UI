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
                                    "@Selector": "/Employer/[EmployerKey]/PaySchedule/[PayScheduleKey]/PayRuns",
                                    "Output": [
                                        {
                                            "@xsi:type": "Max",
                                            "@Name": "LastPayDay",
                                            "@Property": "PaymentDate",
                                            "@Format": "yyyy-MM-dd"
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