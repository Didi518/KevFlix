import ProtectedPage from '../components/common/ProtectedPage';
import FavoriteList from '../pages/FavoriteList';
import HomePage from '../pages/HomePage';
import MediaDetail from '../pages/MediaDetail';
import MediaList from '../pages/MediaList';
import MediaSearch from '../pages/MediaSearch';
import PasswordUpdate from '../pages/PasswordUpdate';
import PersonDetail from '../pages/PersonDetail';
import ReviewList from '../pages/ReviewList';

export const routesGen = {
  home: '/',
  mediaList: (type) => `/${type}`,
  mediaDetail: (type, id) => `/${type}/${id}`,
  mediaSearch: '/recherche',
  person: (id) => `/star/${id}`,
  favoriteList: '/favoris',
  reviewList: '/avis',
  passwordUpdate: '/changement-mdp',
};

const routes = [
  {
    index: true,
    element: <HomePage />,
    state: 'home',
  },
  {
    path: '/star/:personId',
    element: <PersonDetail />,
    state: 'person.detail',
  },
  {
    path: '/recherche',
    element: <MediaSearch />,
    state: 'search',
  },
  {
    path: '/changement-mdp',
    element: (
      <ProtectedPage>
        <PasswordUpdate />
      </ProtectedPage>
    ),
    state: 'password.update',
  },
  {
    path: '/favoris',
    element: (
      <ProtectedPage>
        <FavoriteList />
      </ProtectedPage>
    ),
    state: 'favorites',
  },
  {
    path: '/avis',
    element: (
      <ProtectedPage>
        <ReviewList />
      </ProtectedPage>
    ),
    state: 'reviews',
  },
  {
    path: '/:mediaType',
    element: <MediaList />,
  },
  {
    path: '/:mediaType/:mediaId',
    element: <MediaDetail />,
  },
];

export default routes;
