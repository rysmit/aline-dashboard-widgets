export interface Community {
  id: string;
  name: string;
  careType: string;
  location: string;
  status: 'active' | 'inactive';
}

export const mockCommunities: Community[] = [
  { id: '1', name: 'Sunset Manor', careType: 'Independent Living', location: 'Phoenix, AZ', status: 'active' },
  { id: '2', name: 'Garden View', careType: 'Independent Living', location: 'Tucson, AZ', status: 'active' },
  { id: '3', name: 'Maple Heights', careType: 'Assisted Living', location: 'Denver, CO', status: 'active' },
  { id: '4', name: 'Oak Ridge Care', careType: 'Assisted Living', location: 'Boulder, CO', status: 'active' },
  { id: '5', name: 'Memory Lane', careType: 'Memory Care', location: 'Austin, TX', status: 'active' },
  { id: '6', name: 'Peaceful Minds', careType: 'Memory Care', location: 'Dallas, TX', status: 'active' },
  { id: '7', name: 'Recovery Center', careType: 'Post Acute', location: 'Seattle, WA', status: 'active' },
  { id: '8', name: 'Rehabilitation Plus', careType: 'Post Acute', location: 'Portland, OR', status: 'active' },
  { id: '9', name: 'Golden Years', careType: 'Independent Living', location: 'Miami, FL', status: 'active' },
  { id: '10', name: 'Caring Hands', careType: 'Assisted Living', location: 'Orlando, FL', status: 'active' },
];