import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LiveTvOutlinedIcon from '@mui/icons-material/LiveTvOutlined';
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SlideshowOutlinedIcon from '@mui/icons-material/SlideshowOutlined';

const main = [
  {
    display: 'accueil',
    path: '/',
    icon: <HomeOutlinedIcon />,
    state: 'home',
  },
  {
    display: 'films',
    path: '/movie',
    icon: <SlideshowOutlinedIcon />,
    state: 'movie',
  },
  {
    display: 'séries tv',
    path: '/tv',
    icon: <LiveTvOutlinedIcon />,
    state: 'tv',
  },
  {
    display: 'recherche',
    path: '/recherche',
    icon: <SearchOutlinedIcon />,
    state: 'search',
  },
];

const user = [
  {
    display: 'favoris',
    path: '/favoris',
    icon: <FavoriteBorderOutlinedIcon />,
    state: 'favorite',
  },
  {
    display: 'avis',
    path: '/avis',
    icon: <RateReviewOutlinedIcon />,
    state: 'reviews',
  },
  {
    display: 'changement de mot de passe',
    path: '/changement-mdp',
    icon: <LockResetOutlinedIcon />,
    state: 'password.update',
  },
];

const menuConfigs = { main, user };

export default menuConfigs;
