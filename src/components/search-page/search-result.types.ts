export interface AuthorityRow {
  id: string;
  type: string;
  nationality: string;
  heading: string;
  author: string;
  years: string;
  field: string;
  source: string;
  controlNumber: string;
  creator: string;
  modifiedBy: string;
}

export interface OrganizationRow {
  id: string;
  type: string;
  nationality: string;
  heading: string;
  organizationType: string;
  established: string;
  field: string;
  source: string;
  controlNumber: string;
  creator: string;
  modifiedBy: string;
}

export interface GeographyRow {
  id: string;
  type: string;
  nationality: string;
  heading: string;
  source: string;
  controlNumber: string;
  creator: string;
  modifiedBy: string;
}

export interface SubjectRow {
  id: string;
  type: string;
  nationality: string;
  heading: string;
  source: string;
  note: string;
  controlNumber: string;
  creator: string;
  modifiedBy: string;
}
