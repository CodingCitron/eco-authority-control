// 개인형
export interface PersonalRow {
  id: string;
  type: string;
  nationality: string;
  heading: string;
  hanjaName: string;
  years: string;
  field: string;
  source: string;
  controlNumber: string;
  creator: string;
  modifiedBy: string;
}

// 단체형
export interface CorporationRow {
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

// 지리형
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

// 주제형
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

export type AuthoritySearchType =
  | "personal"
  | "corporation"
  | "geography"
  | "subject";
