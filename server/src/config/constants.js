export const BANGLADESH_LOCATIONS = [
  'Dhaka - Dhanmondi',
  'Dhaka - Gulshan',
  'Dhaka - Banani',
  'Dhaka - Uttara',
  'Dhaka - Mirpur',
  'Dhaka - Mohammadpur',
  'Dhaka - Bashundhara R/A',
  'Dhaka - Badda',
  'Dhaka - Old Dhaka',
  'Chattogram - Agrabad',
  'Chattogram - Nasirabad',
  'Chattogram - Panchlaish',
  'Sylhet - Zindabazar',
  'Sylhet - Amberkhana',
  'Rajshahi - Shaheb Bazar',
  'Khulna - Sonadanga',
  'Cumilla - Kandirpar',
  'Gazipur - Tongi'
];

export const JOB_CATEGORIES = [
  'Cleaning',
  'Gardening',
  'Moving and Shifting',
  'Plumbing',
  'Electrical Work',
  'Repairs and Maintenance',
  'Car Wash',
  'Construction and Labour',
  'Tutoring',
  'Photography and Events',
  'Delivery and Errands',
  'Hospitality',
  'Other Local Jobs'
];

export const SERVICE_CATEGORIES = [
  'Cleaning',
  'Gardening',
  'Repairs and Maintenance',
  'Plumbing',
  'Electrical Work',
  'Moving and Shifting',
  'Tutoring',
  'Photography and Events',
  'Car Wash',
  'Computer & Tech Support',
  'Other Services'
];

export const PRODUCT_CATEGORIES = [
  'Electronics & Gadgets',
  'Home & Furniture',
  'Tools & Hardware',
  'Books & Stationery',
  'Clothing & Fashion',
  'Sports & Fitness',
  'Vehicles & Bicycles',
  'Other'
];

export const FREE_ITEM_CATEGORIES = [
  'Furniture',
  'Books & Study Materials',
  'Clothing',
  'Kitchen & Household',
  'Electronics',
  'Toys & Baby Items',
  'Other Free Items'
];

export const STATUS = {
  JOB: {
    OPEN: 'Open',
    ASSIGNED: 'Assigned',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled'
  },
  APPLICATION: {
    APPLIED: 'Applied',
    UNDER_REVIEW: 'Under Review',
    ACCEPTED: 'Accepted',
    REJECTED: 'Rejected'
  },
  SERVICE: {
    ACTIVE: 'Active',
    PAUSED: 'Paused',
    ARCHIVED: 'Archived'
  },
  QUOTE: {
    PENDING: 'Pending',
    RESPONDED: 'Responded',
    ACCEPTED: 'Accepted',
    DECLINED: 'Declined'
  },
  PRODUCT: {
    AVAILABLE: 'Available',
    RESERVED: 'Reserved',
    SOLD: 'Sold'
  },
  FREE_ITEM: {
    AVAILABLE: 'Available',
    RESERVED: 'Reserved',
    COLLECTED: 'Collected'
  },
  PROOFBOX: {
    DRAFT: 'Draft',
    IN_PROGRESS: 'In Progress',
    SUBMITTED_FOR_APPROVAL: 'Submitted for Approval',
    CORRECTIONS_REQUESTED: 'Corrections Requested',
    APPROVED: 'Approved'
  },
  VERIFICATION: {
    NOT_STARTED: 'Not Started',
    SUBMITTED: 'Submitted',
    UNDER_REVIEW: 'Under Review',
    VERIFIED: 'Verified',
    REJECTED: 'Rejected',
    RESUBMISSION_REQUIRED: 'Resubmission Required'
  }
};

export const MATCHING_WEIGHTS = {
  categoryAndSkill: 0.35,
  availability: 0.25,
  location: 0.20,
  experience: 0.10,
  rating: 0.10
};
