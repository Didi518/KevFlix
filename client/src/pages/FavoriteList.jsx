import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import favoriteApi from '../api/modules/favorite.api';
import { setGlobalLoading } from '../app/features/globalLoadingSlice';
import { removeFavorite } from '../app/features/userSlice';
import Container from '../components/common/Container';
import MediaItem from '../components/common/MediaItem';
import uiConfigs from '../configs/ui.configs';

const FavoriteItem = ({ media, onRemoved }) => {
  const dispatch = useDispatch();
  const [onRequest, setOnRequest] = useState(false);

  const onRemove = async () => {
    if (onRequest) return;
    setOnRequest(true);

    const { response, error } = await favoriteApi.remove({
      favoriteId: media.id,
    });

    setOnRequest(false);
    if (error) toast.error(error.message);
    if (response) {
      toast.success('Supprimé de vos favoris');
      dispatch(removeFavorite({ mediaId: media.mediaId }));
      onRemoved(media.id);
    }
  };

  return (
    <>
      <MediaItem media={media} mediaType={media.mediaType} />
      <LoadingButton
        fullWidth
        variant="contained"
        sx={{ marginTop: 2 }}
        startIcon={<DeleteIcon />}
        loadingPosition="start"
        loading={onRequest}
        onClick={onRemove}
      ></LoadingButton>
    </>
  );
};

const FavoriteList = () => {
  const [medias, setMedias] = useState([]);
  const [filteredMedias, setFilteredMedias] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const skip = 8;
  const dispatch = useDispatch();

  useEffect(() => {
    const getFavorites = async () => {
      dispatch(setGlobalLoading(true));

      const { response, error } = await favoriteApi.getList();

      dispatch(setGlobalLoading(false));
      if (error) toast.error(error.message);
      if (response) {
        setCount(response.length);
        setMedias([...response]);
        setFilteredMedias([...response].splice(0, skip));
      }
    };

    getFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onLoadMore = () => {
    setFilteredMedias([
      ...filteredMedias,
      ...[...medias].splice(page * skip, skip),
    ]);
    setPage(page + 1);
  };

  const onRemoved = (id) => {
    const newMedias = [...medias].filter((e) => e.id !== id);
    setMedias(newMedias);
    setFilteredMedias([...newMedias].splice(0, page * skip));
    setCount(count - 1);
  };

  return (
    <Box sx={{ ...uiConfigs.style.mainContent }}>
      <Container header={`Vos favoris (${count})`}>
        <Grid container spacing={1} sx={{ marginRight: '-8px !important' }}>
          {filteredMedias.map((media, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <FavoriteItem media={media} onRemoved={onRemoved} />
            </Grid>
          ))}
        </Grid>
        {filteredMedias.length < medias.length && (
          <Button onClick={onLoadMore}>charger plus</Button>
        )}
      </Container>
    </Box>
  );
};

export default FavoriteList;
