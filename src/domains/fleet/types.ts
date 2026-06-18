export interface DriverRecord {
  _id: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  licenseNumber?: string;
  licenseDuration?: string;
  birthDate?: string;
  company?: { _id?: string; name?: string };
  image?: string;
  sexe?: string;
  nationality?: string;
  begginingAt?: string;
  adresse?: string;
}
