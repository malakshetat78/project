export const REQUIREMENT_SETS = {
  icvsp: {label:'ICVSP Requirements',key:'workbook/ICVSP_V-Cycle_Reviewed_Updated.xlsx',filename:'ICVSP_V-Cycle_Reviewed_Updated.xlsx'},
  security: {label:'Security Requirements',key:'workbook/ICVSP_Security_V-Cycle.xlsx',filename:'ICVSP_Security_V-Cycle.xlsx'}
} as const;
export type RequirementSet=keyof typeof REQUIREMENT_SETS;
export function requirementSet(value:any):RequirementSet {
  if(value==null)return 'icvsp';
  if(value!=='icvsp'&&value!=='security')throw Error('Unknown requirement set.');
  return value;
}
