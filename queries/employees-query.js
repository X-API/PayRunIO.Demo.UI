module.exports = {
    "Query": {
        "RootNodeName": "EmployeesTable",
        "Variables": {
            "Variable": [
                {
                    "@Name": "[EmployerKey]",
                    "@Value": "$$EmployerKey$$"
                }
            ]
        },
        "Groups": {
            "Group": [
                {
                    "@ItemName": "Employees",
                    "@Selector": "/Employer/[EmployerKey]/Employees",
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
                        },
                        {
                            "@xsi:type": "RenderProperty",
                            "@Name": "PaySchedule",
                            "@Property": "PaySchedule.Title"
                        },
                        {
                            "@xsi:type": "RenderProperty",
                            "@Output": "Variable",
                            "@Name": "[PayScheduleHref]",
                            "@Property": "PaySchedule.Href"
                        },
                        {
                            "@xsi:type": "RenderUniqueKeyFromLink",
                            "@Name": "PayScheduleKey",
                            "@Href": "[PayScheduleHref]"
                        },
                        {
                            "@xsi:type": "RenderProperty",
                            "@Name": "NiNumber",
                            "@Property": "NiNumber"
                        },
                        {
                            "@xsi:type": "RenderProperty",
                            "@Output": "Variable",
                            "@Name": "[LeavingDate]",
                            "@Property": "LeavingDate"
                        },
                        {
                            "@xsi:type": "RenderProperty",
                            "@Output": "Variable",
                            "@Name": "[StartDate]",
                            "@Property": "StartDate"
                        },
                        {
                            "@xsi:type": "RenderValue",
                            "@Output": "Variable",
                            "@Name": "[Status]",
                            "@Value": "Active"
                        }
                    ],
                    "Group": [
                        {
                            "@Selector": "/Employer/[EmployerKey]/Employee/[EmployeeKey]/PayInstructions",
                            "Filter": [
                                {
                                    "@xsi:type": "OfType",
                                    "@Value": "NiPayInstruction"
                                },
                                {
                                    "@xsi:type": "TakeFirst",
                                    "@Value": "1"
                                }
                            ],
                            "Output": [
                                {
                                    "@xsi:type": "RenderProperty",
                                    "@Name": "NiLetter",
                                    "@Property": "NiLetter"
                                }
                            ],
                            "Order": {
                                "@xsi:type": "Descending",
                                "@Property": "StartDate"
                            }
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
                                    "@xsi:type": "Max",
                                    "@Output": "Variable",
                                    "@Name": "[LastPayDay]",
                                    "@Property": "PaymentDate",
                                    "@Format": "yyyy-MM-dd"
                                },
                                {
                                    "@xsi:type": "RenderProperty",
                                    "@Output": "Variable",
                                    "@Name": "[PayFrequency]",
                                    "@Property": "PayFrequency",
                                    "@Format": "yyyy-MM-dd"
                                },
                                {
                                    "@xsi:type": "RenderValue",
                                    "@Name": "LastPayDay",
                                    "@Value": "[LastPayDay]"
                                },
                                {
                                	"@xsi:type": "RenderProperty",
                                    "@Name": "TaxYear",
                                    "@Property": "TaxYear"
                                },
                                {
                                    "@xsi:type": "RenderNextDate",
                                    "@Output": "Variable",
                                    "@Name": "[NextPayDay]",
                                    "@Date": "[LastPayDay]",
                                    "@PayFrequency": "[PayFrequency]",
                                    "@Format": "yyyy-MM-dd"
                                },
                                {
                                    "@xsi:type": "RenderValue",
                                    "@Name": "NextPayDay",
                                    "@Value": "[NextPayDay]"
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
                            "Condition": {
                                "@xsi:type": "WhenLessThan",
                                "@ValueA": "[LeavingDate]",
                                "@ValueB": "[NextPayDay]"
                            },
                            "Output": {
                                "@xsi:type": "RenderValue",
                                "@Output": "Variable",
                                "@Name": "[Status]",
                                "@Value": "Leaver"
                            }
                        },
                        {
                            "@Selector": "/Employer/[EmployerKey]/Employee/[EmployeeKey]/PayInstructions",
                            "Filter": [
                                {
                                    "@xsi:type": "OfType",
                                    "@Value": "TaxPayInstruction"
                                },
                                {
                                    "@xsi:type": "TakeFirst",
                                    "@Value": "1"
                                }
                            ],
                            "Output": [
                                {
                                    "@xsi:type": "RenderProperty",
                                    "@Output": "Variable",
                                    "@Name": "$taxCode",
                                    "@Property": "TaxCode"
                                },
                                {
                                    "@xsi:type": "RenderProperty",
                                    "@Output": "Variable",
                                    "@Name": "$taxBasis",
                                    "@Property": "TaxBasis"
                                }
                            ],
                            "Order": {
                                "@xsi:type": "Descending",
                                "@Property": "StartDate"
                            },
                            "Group": [
                                {
                                    "Condition": {
                                        "@xsi:type": "When",
                                        "@ValueA": "$taxBasis",
                                        "@ValueB": "Week1Month1"
                                    },
                                    "Output": [
                                        {
                                            "@xsi:type": "RenderValue",
                                            "@Output": "VariableAppend",
                                            "@Name": "$taxCode",
                                            "@Value": "/1"
                                        },
                                        {
                                            "@xsi:type": "RenderValue",
                                            "@Name": "TaxCode",
                                            "@Value": "$taxCode"
                                        }
                                    ]
                                },
                                {
                                    "Condition": {
                                        "@xsi:type": "WhenNot",
                                        "@ValueA": "$taxBasis",
                                        "@ValueB": "Week1Month1"
                                    },
                                    "Output": {
                                        "@xsi:type": "RenderValue",
                                        "@Name": "TaxCode",
                                        "@Value": "$taxCode"
                                    }
                                },
                                {
                                    "Output": {
                                        "@xsi:type": "RenderValue",
                                        "@Name": "Status",
                                        "@Value": "[Status]"
                                    }
                                }
                        	]
                        }
                    ]
                }
            ]
        }
    }
};