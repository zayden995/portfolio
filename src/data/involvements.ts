/**
 * Involvements.
 *
 * The page renders one block per group: an intro with the organisations and
 * roles, then a horizontal track of events you scroll sideways through.
 *
 * IMAGES: every `image` below is an Unsplash placeholder. Drop your own photos
 * into `public/photos/` and swap the URL for "/photos/your-file.jpg".
 */

export type Role = {
  title: string;
  period: string;
  highlights: string[];
};

export type Organisation = {
  name: string;
  /** The short form people actually say. */
  abbreviation?: string;
  /** Newest first. */
  roles: Role[];
};

export type InvolvementEvent = {
  slug: string;
  title: string;
  /** Which group ran it — shown as a tag on the card. */
  org: string;
  period: string;
  /** Two or three lines. Split by line and animated in on scroll. */
  description: string;
  image: string;
  imageAlt: string;
};

export type InvolvementGroup = {
  slug: string;
  title: string;
  kind: string;
  /** Which colour world this chapter sits in. */
  tint: 'school' | 'community';
  period: string;
  summary: string;
  /** A short line that sits inside the photo wall. Keep it to one sentence. */
  pullQuote: string;
  organisations: Organisation[];
  events: InvolvementEvent[];
};

const UNSPLASH = 'https://images.unsplash.com/photo-';
const CROP = '?auto=format&fit=crop&w=1200&q=80';

export const involvementGroups: InvolvementGroup[] = [
  {
    slug: 'singapore-polytechnic',
    title: 'Singapore Polytechnic',
    kind: 'School CCAs',
    tint: 'school',
    period: 'Apr 2025 — Present',
    summary:
      'Two student groups in SP’s School of Computing. One runs the events; the other makes sure people hear about them. Between them I have planned orientation for an incoming cohort and led publicity for a school-wide programme.',
    pullQuote:
      'It is never really about the event. It is about whether anyone turns up, and whether the day runs.',
    organisations: [
      {
        name: 'School of Computing Club',
        abbreviation: 'SOCC',
        roles: [
          {
            title: 'Project Head',
            period: 'Apr 2026 — Present',
            highlights: [
              'Plan and run student engagement events from first brief to closing night.',
              'Coordinate logistics and operations across concurrent initiatives.',
              'Work across teams so execution stays smooth on the day.',
            ],
          },
          {
            title: 'Events Organising Committee, Freshman Orientation Camp & Programme',
            period: 'AY26/27',
            highlights: [
              'Planned and ran a large-scale orientation programme for incoming students.',
              'Managed logistics, scheduling, and on-ground coordination.',
              'Held the participant experience steady through high-pressure operations.',
            ],
          },
          {
            title: 'Admin Subcommittee',
            period: 'Apr 2025 — Apr 2026',
            highlights: [
              'Supported administrative and logistical planning across the club’s events.',
              'Helped coordinate Movie Night, Shirt Sales, the Sustainability Hackathon, and Hearts & Homies.',
            ],
          },
        ],
      },
      {
        name: 'School of Computing Ambassadors',
        abbreviation: 'SOCA',
        roles: [
          {
            title: 'Vice-Head of Publicity',
            period: 'Apr 2026 — Present',
            highlights: [
              'Lead publicity for school initiatives including Freshman Orientation Programme 2026, SPxHP workshop and Industry Connect 2026.',
              'Coordinate the team to plan and run promotional campaigns.',
              'Grew event visibility and student engagement across the school.',
            ],
          },
          {
            title: 'Publicity Subcommittee',
            period: 'Jan 2026 — Apr 2026',
            highlights: [
              'Supported publicity planning and content coordination.',
              'Promoted school events including SP Open House 2026 and DSTA BrainHack.',
            ],
          },
        ],
      },
    ],
    events: [
      {
        slug: 'orientation',
        title: 'Freshman Orientation Camp & Programme',
        org: 'SOCC',
        period: 'AY26/27',
        description:
          'Orientation for the incoming cohort. I sat on the organising committee, handling logistics, scheduling, and on-ground coordination.',
        image: `${UNSPLASH}1523240795612-9a054b0db644${CROP}`,
        imageAlt: '[Placeholder — swap for a photo from orientation]',
      },
      {
        slug: 'industry-connect',
        title: 'Industry Connect 2026',
        org: 'SOCA',
        period: '2026',
        description:
          'A programme connecting students with people working in the industry. I led the publicity campaign that filled the room.',
        image: `${UNSPLASH}1540575467063-178a50c2df87${CROP}`,
        imageAlt: '[Placeholder — swap for a photo from Industry Connect]',
      },
      {
        slug: 'spxhp',
        title: 'SPxHP Workshop',
        org: 'SOCA',
        period: '2026',
        description:
          'A workshop run with HP. I led publicity for it, planning the campaign and coordinating the team behind it.',
        image: `${UNSPLASH}1531482615713-2afd69097998${CROP}`,
        imageAlt: '[Placeholder — swap for a photo from the workshop]',
      },
      {
        slug: 'sustainability-hackathon',
        title: 'Sustainability Hackathon',
        org: 'SOCC',
        period: '2025',
        description:
          'A hackathon on sustainability themes. I helped coordinate it from the Admin Subcommittee. [Add a line on what the teams built.]',
        image: `${UNSPLASH}1522071820081-009f0129c71c${CROP}`,
        imageAlt: '[Placeholder — swap for a photo from the hackathon]',
      },
      {
        slug: 'open-house',
        title: 'SP Open House 2026',
        org: 'SOCA',
        period: '2026',
        description:
          'The school’s open house for prospective students. I helped promote it as part of the Publicity Subcommittee.',
        image: `${UNSPLASH}1511578314322-379afb476865${CROP}`,
        imageAlt: '[Placeholder — swap for a photo from Open House]',
      },
      {
        slug: 'brainhack',
        title: 'DSTA BrainHack',
        org: 'SOCA',
        period: '2026',
        description:
          'DSTA’s national tech competition. I helped promote it to students across the school. [Add what your part involved.]',
        image: `${UNSPLASH}1517245386807-bb43f82c33c4${CROP}`,
        imageAlt: '[Placeholder — swap for a photo from BrainHack]',
      },
      {
        slug: 'hearts-and-homies',
        title: 'Hearts & Homies',
        org: 'SOCC',
        period: '2026',
        description:
          '[One line on what Hearts & Homies is.] I assisted with coordination from the Admin Subcommittee.',
        image: `${UNSPLASH}1552664730-d307ca884978${CROP}`,
        imageAlt: '[Placeholder — swap for a photo from the event]',
      },
      {
        slug: 'movie-night',
        title: 'Movie Night',
        org: 'SOCC',
        period: '2025',
        description:
          'A social night for the student body. I assisted with the coordination and logistics behind it.',
        image: `${UNSPLASH}1489599849927-2ee91cede3ba${CROP}`,
        imageAlt: '[Placeholder — swap for a photo from movie night]',
      },
      {
        slug: 'shirt-sales',
        title: 'Shirt Sales',
        org: 'SOCC',
        period: '2025',
        description:
          'The club’s merchandise run. I helped with the planning and day-to-day coordination.',
        image: `${UNSPLASH}1489987707025-afc232f7ea0f${CROP}`,
        imageAlt: '[Placeholder — swap for a photo of the shirts]',
      },
    ],
  },
  {
    slug: 'chong-hua-tong',
    title: 'Chong Hua Tong Tou Teck Hwee',
    kind: 'Community',
    tint: 'community',
    period: '2012 — Present',
    summary:
      'The community I grew up in and have belonged to since 2012. Now that I am older I help run its Sunday programme for the younger students — the seat I was once sitting in.',
    pullQuote: 'Thirteen years in one place teaches you something: you keep showing up.',
    organisations: [
      {
        name: 'Chong Hua Tong Tou Teck Hwee',
        roles: [
          {
            title: 'Member and volunteer',
            period: 'Since 2012',
            highlights: [
              'Help plan and run weekly Sunday classes for around 20 students aged 10 to 16.',
              'Support academic tutoring, alongside a short session on morals and values.',
              'Help with food catering at temple events.',
              'Take part in camps and performances, and help run them.',
              'Handle the planning and on-the-day running of activities.',
            ],
          },
        ],
      },
    ],
    events: [
      {
        slug: 'sunday-classes',
        title: 'Sunday Academic Classes',
        org: 'Weekly',
        period: 'Every Sunday',
        description:
          'Classes helping students aged 10 to 16 with their schoolwork. Around 20 come through each week.',
        image: `${UNSPLASH}1509062522246-3755977927d7${CROP}`,
        imageAlt: '[Placeholder — swap for a photo of the classes]',
      },
      {
        slug: 'values-session',
        title: 'Morals & Values Session',
        org: 'Weekly',
        period: 'Every Sunday',
        description:
          'A short session after the academic classes, teaching the younger students about morals and values.',
        image: `${UNSPLASH}1524178232363-1fb2b075b655${CROP}`,
        imageAlt: '[Placeholder — swap for a photo of the session]',
      },
      {
        slug: 'camps-performances',
        title: 'Camps & Performances',
        org: 'Since 2012',
        period: 'Through the year',
        description:
          'Taking part in the temple’s camps and performances, and helping run them.',
        image: `${UNSPLASH}1560523159-4a9692d222f9${CROP}`,
        imageAlt: '[Placeholder — swap for a photo from the activity]',
      },
      {
        slug: 'catering',
        title: 'Food & Catering',
        org: 'Community',
        period: 'Through the year',
        description:
          'Helping with the food and catering that keeps temple events running.',
        image: `${UNSPLASH}1488521787991-ed7bbaae773c${CROP}`,
        imageAlt: '[Placeholder — swap for a photo from the community]',
      },
    ],
  },
];

/**
 * Flattened for the home page: every organisation with the role you hold there
 * now. Derived, so it never drifts out of step with the list above.
 */
export const currentRoles = involvementGroups.flatMap((group) =>
  group.organisations.map((org) => ({
    organisation: org.name,
    abbreviation: org.abbreviation,
    role: org.roles[0]?.title ?? '',
    period: org.roles[0]?.period ?? group.period,
  })),
);
