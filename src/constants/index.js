import { createCampaign, dashboard, update, verify } from '../assets';

export const navlinks = [
  {
    name: 'dashboard',
    imgUrl: dashboard,
    link: '/',
  },
  {
    name: 'campaign',
    imgUrl: createCampaign,
    link: '/create-campaign',
  },
  {
    name: 'updateDatalink',
    imgUrl: update,
    link: '/update-data-link',
  },
  {
    name: 'verifyOwnership',
    imgUrl: verify,
    link: '/verify-ownership',
  },

];
