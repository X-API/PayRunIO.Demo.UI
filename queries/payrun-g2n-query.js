module.exports = {
    "Query": {
            "RootNodeName": "PayrunG2N",
            "Variables": {
                "Variable": [
                    {
                        "@Name": "[EmployerKey]",
                        "@Value": "$$EmployerKey$$"
                    },
                    {
                        "@Name": "[PayScheduleKey]",
                        "@Value": "$$PayScheduleKey$$"
                    },
                    {
                        "@Name": "[PayRunKey]",
                        "@Value": "$$PayRunKey$$"
                    }
                ]
            },
            "Groups": {
            	"Group": {
                    "@GroupName": "PaySchedule",
                    "@Selector": "/Employer/[EmployerKey]/PaySchedule/[PayScheduleKey]",
                    "Output": [
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
                "Group": {
                    "@GroupName": "PayRun",
                    "@Selector": "/Employer/[EmployerKey]/PaySchedule/[PayScheduleKey]/PayRun/[PayRunKey]",
                    "Output": [
                        {
                            "@xsi:type": "RenderProperty",
                            "@Output": "Variable",
                            "@Name": "[PaymentDate]",
                            "@Property": "PaymentDate"
                        },
                        {
                            "@xsi:type": "RenderProperty",
                            "@Output": "Variable",
                            "@Name": "[TaxYear]",
                            "@Property": "TaxYear"
                        },
                        {
                            "@xsi:type": "RenderProperty",
                            "@Output": "Variable",
                            "@Name": "[TaxPeriod]",
                            "@Property": "TaxPeriod"
                        },
                        {
                            "@xsi:type": "RenderValue",
                            "@Name": "PaymentDate",
                            "@Value": "[PaymentDate]",
                            "@Format": "yyyy-MM-dd"
                        },
                        {
                            "@xsi:type": "RenderValue",
                            "@Name": "TaxYear",
                            "@Value": "[TaxYear]"
                        },
                        {
                            "@xsi:type": "RenderValue",
                            "@Name": "TaxPeriod",
                            "@Value": "[TaxPeriod]"
                        },
                        {
                            "@xsi:type": "RenderProperty",
                            "@Name": "PeriodStart",
                            "@Property": "PeriodStart",
                            "@Format": "yyyy-MM-dd"
                        },
                        {
                            "@xsi:type": "RenderProperty",
                            "@Name": "PeriodEnd",
                            "@Property": "PeriodEnd",
                            "@Format": "yyyy-MM-dd"
                        }
                    ],
                    "Group": {
                        "@ItemName": "Employees",
                        "@Selector": "/Employer/[EmployerKey]/PaySchedule/[PayScheduleKey]/PayRun/[PayRunKey]/Employees",
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
                                "@Name": "Code",
                                "@Property": "Code"
                            },
                            {
                                "@xsi:type": "RenderProperty",
                                "@Output": "Variable",
                                "@Name": "Name",
                                "@Property": "FirstName"
                            },
                            {
                                "@xsi:type": "RenderValue",
                                "@Output": "VariableAppend",
                                "@Name": "Name",
                                "@Value": " "
                            },
                            {
                                "@xsi:type": "RenderProperty",
                                "@Output": "VariableAppend",
                                "@Name": "Name",
                                "@Property": "LastName"
                            },
                            {
                                "@xsi:type": "RenderValue",
                                "@Name": "Name",
                                "@Value": "Name"
                            }
                        ],
                        "Order": [
                            {
                                "@xsi:type": "Ascending",
                                "@Property": "LastName"
                            },
                            {
                                "@xsi:type": "Ascending",
                                "@Property": "FirstName"
                            }
                        ],
                        "Group": {
                            "@Selector": "/Employer/[EmployerKey]/Employee/[EmployeeKey]/PayLines",
                            "Filter": [
                                {
                                    "@xsi:type": "EqualTo",
                                    "@Property": "TaxYear",
                                    "@Value": "[TaxYear]"
                                },
                                {
                                    "@xsi:type": "EqualTo",
                                    "@Property": "TaxPeriod",
                                    "@Value": "[TaxPeriod]"
                                },
                                {
                                    "@xsi:type": "EqualTo",
                                    "@Property": "PaymentDate",
                                    "@Value": "[PaymentDate]"
                                }
                            ],
                            "Output": [
                                {
                                    "@xsi:type": "Sum",
                                    "@Name": "PAYMENTS",
                                    "@Property": "Value",
                                    "@Format": "0.00",
                                    "@DefaultValue": "0.00",
                                    "Filter": [
                                        {
                                            "@xsi:type": "EqualTo",
                                            "@Property": "PayCodeType",
                                            "@Value": "Payment"
                                        }
                                    ]
                                },
                                {
                                    "@xsi:type": "Sum",
                                    "@Name": "EE_NI",
                                    "@Property": "Value",
                                    "@Format": "0.00",
                                    "@DefaultValue": "0.00",
                                    "Filter": {
                                        "@xsi:type": "OfType",
                                        "@Value": "PayLineNi"
                                    }
                                },
                                {
                                    "@xsi:type": "Sum",
                                    "@Name": "ER_NI",
                                    "@Property": "EmployerNI",
                                    "@Format": "0.00",
                                    "@DefaultValue": "0.00",
                                    "Filter": {
                                        "@xsi:type": "OfType",
                                        "@Value": "PayLineNi"
                                    }
                                },
                                {
                                    "@xsi:type": "Sum",
                                    "@Name": "TAX",
                                    "@Property": "Value",
                                    "@Format": "0.00",
                                    "@DefaultValue": "0.00",
                                    "Filter": {
                                        "@xsi:type": "OfType",
                                        "@Value": "PayLineTax"
                                    }
                                },
                                {
                                    "@xsi:type": "Sum",
                                    "@Name": "OTHERDEDNS",
                                    "@Property": "Value",
                                    "@Format": "0.00",
                                    "@DefaultValue": "0.00",
                                    "Filter": [
                                        {
                                            "@xsi:type": "NotWithinArray",
                                            "@Property": "PayCode",
                                            "@Value": "NI,TAX"
                                        },
                                        {
                                            "@xsi:type": "EqualTo",
                                            "@Property": "PayCodeType",
                                            "@Value": "Deduction"
                                        }
                                    ]
                                },
                                {
                                    "@xsi:type": "Sum",
                                    "@Name": "NETPAY",
                                    "@Property": "Value",
                                    "@Format": "0.00",
                                    "@DefaultValue": "0.00"
                                }
                            ]
                        }
                    }
                }
            }
        }
    }
};
