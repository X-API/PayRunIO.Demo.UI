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
                            "@Name": "[NextPayDay]",
                            "@Output": "Variable",
                            "@Date": "[LastPayDay]",
                            "@PayFrequency": "[PayFrequency]",
                            "@Format": "yyyy-MM-dd"
                        },
                        {
                        	"@xsi:type": "RenderValue",
                            "@Name": "NextPayDay",
                            "@Value": "[NextPayDay]",
                            "@Format": "yyyy-MM-dd"
                        },
                        {
                            "@xsi:type": "RenderTaxPeriod",
                            "@DisplayName": "[NextTaxPeriod]",
                            "@Output": "Variable",
                            "@PayFrequency": "[PayFrequency]",
                            "@Date": "[NextPayDay]",
                            "@RenderOption": "PeriodOnly"
                        },
                        {
                            "@xsi:type": "RenderTaxPeriod",
                            "@DisplayName": "[NextTaxYear]",
                            "@Output": "Variable",
                            "@PayFrequency": "[PayFrequency]",
                            "@Date": "[NextPayDay]",
                            "@RenderOption": "YearOnly"
                        },
                        {
                            "@xsi:type": "RenderTaxPeriodDate",
                            "@DisplayName": "NextTaxPeriodStart",
                            "@Output": "Element",
                            "@TaxYear": "[NextTaxYear]",
                            "@TaxPeriod": "[NextTaxPeriod]",
                            "@PayFrequency": "[PayFrequency]",
                            "@EndDate": "false"
                        },
                        {
                            "@xsi:type": "RenderTaxPeriodDate",
                            "@DisplayName": "NextTaxPeriodEnd",
                            "@Output": "Element",
                            "@TaxYear": "[NextTaxYear]",
                            "@TaxPeriod": "[NextTaxPeriod]",
                            "@PayFrequency": "[PayFrequency]",
                            "@EndDate": "true"
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
                        },
                        {
                            "@xsi:type": "RenderValue",
                            "@Name": "LastPayDay",
                            "@Value": "[LastPayDay]",
                            "@Format": "yyyy-MM-dd"
                        },
                        {
                            "@xsi:type": "RenderValue",
                            "@Name": "LastPeriodStart",
                            "@Value": "[LastPeriodStart]",
                            "@Format": "yyyy-MM-dd"
                        },
                        {
                            "@xsi:type": "RenderValue",
                            "@Name": "LastPeriodEnd",
                            "@Value": "[LastPeriodEnd]",
                            "@Format": "yyyy-MM-dd"
                        },
                        {
                            "@xsi:type": "RenderTaxPeriod",
                            "@DisplayName": "[LastTaxPeriod]",
                            "@Output": "Variable",
                            "@PayFrequency": "[PayFrequency]",
                            "@Date": "[LastPayDay]",
                            "@RenderOption": "PeriodOnly"
                        },
                        {
                            "@xsi:type": "RenderTaxPeriod",
                            "@DisplayName": "[LastTaxYear]",
                            "@Output": "Variable",
                            "@PayFrequency": "[PayFrequency]",
                            "@Date": "[LastPayDay]",
                            "@RenderOption": "YearOnly"
                        },
                        {
                            "@xsi:type": "RenderTaxPeriodDate",
                            "@DisplayName": "LastTaxPeriodStart",
                            "@Output": "Element",
                            "@TaxYear": "[LastTaxYear]",
                            "@TaxPeriod": "[LastTaxPeriod]",
                            "@PayFrequency": "[PayFrequency]",
                            "@EndDate": "false"
                        },
                        {
                            "@xsi:type": "RenderTaxPeriodDate",
                            "@DisplayName": "LastTaxPeriodEnd",
                            "@Output": "Element",
                            "@TaxYear": "[LastTaxYear]",
                            "@TaxPeriod": "[LastTaxPeriod]",
                            "@PayFrequency": "[PayFrequency]",
                            "@EndDate": "true"
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
