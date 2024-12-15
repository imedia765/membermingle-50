export interface Member {
  id: string;
  member_number: string;
  collector_id?: string;
  full_name: string;
  date_of_birth?: string;
  gender?: string;
  marital_status?: string;
  email?: string;
  phone?: string;
  address?: string;
  postcode?: string;
  town?: string;
  status?: string;
  verified?: boolean;
  created_at: string;
  updated_at: string;
  membership_type?: string;
  collector?: string;
  cors_enabled?: boolean;
}