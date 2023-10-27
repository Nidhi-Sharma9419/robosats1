import React, { useContext } from 'react';
import {
  Grid,
  Select,
  MenuItem,
  Box,
  Tooltip,
  Typography,
  type SelectChangeEvent,
} from '@mui/material';

import RobotAvatar from '../RobotAvatar';
import { AppContext, type UseAppStoreType } from '../../contexts/AppContext';
import { useTheme } from '@emotion/react';
import { useTranslation } from 'react-i18next';
import { FederationContext, UseFederationStoreType } from '../../contexts/FederationContext';

interface SelectCoordinatorProps {
  coordinator: string;
  setCoordinator: (coordinator: string) => void;
}

const SelectCoordinator: React.FC<SelectCoordinatorProps> = ({ coordinator, setCoordinator }) => {
  const { setOpen, hostUrl } = useContext<UseAppStoreType>(AppContext);
  const { federation, setFocusedCoordinator, sortedCoordinators } =
    useContext<UseFederationStoreType>(FederationContext);
  const theme = useTheme();
  const { t } = useTranslation();

  const onClickCurrentCoordinator = function (shortAlias: string): void {
    setFocusedCoordinator(shortAlias);
    setOpen((open) => {
      return { ...open, coordinator: true };
    });
  };

  const handleCoordinatorChange = (e: SelectChangeEvent<string>): void => {
    setCoordinator(e.target.value);
  };

  return (
    <Grid item>
      <Tooltip
        placement='top'
        enterTouchDelay={500}
        enterDelay={700}
        enterNextDelay={2000}
        title={t(
          'The provider the lightning and communication infrastructure. The host will be in charge of providing support and solving disputes. The trade fees are set by the host. Make sure to only select order hosts that you trust!',
        )}
      >
        <Box
          sx={{
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderRadius: '4px',
            borderColor: theme.palette.mode === 'dark' ? '#434343' : '#c4c4c4',
            '&:hover': {
              borderColor: theme.palette.mode === 'dark' ? '#ffffff' : '#2f2f2f',
            },
          }}
        >
          <Typography variant='caption' color='text.secondary'>
            &nbsp;{t('Order Host')}
          </Typography>

          <Grid container>
            <Grid
              item
              xs={3}
              sx={{ cursor: 'pointer', position: 'relative', left: '0.3em', bottom: '0.1em' }}
              onClick={() => {
                onClickCurrentCoordinator(coordinator);
              }}
            >
              <Grid item>
                <RobotAvatar
                  nickname={coordinator}
                  coordinator={true}
                  style={{ width: '3em', height: '3em' }}
                  smooth={true}
                  flipHorizontally={true}
                  baseUrl={hostUrl}
                  small={true}
                />
              </Grid>
            </Grid>

            <Grid item xs={9}>
              <Select
                variant='standard'
                fullWidth
                required={true}
                inputProps={{
                  style: { textAlign: 'center' },
                }}
                value={coordinator}
                onChange={handleCoordinatorChange}
                disableUnderline
              >
                {sortedCoordinators.map((shortAlias: string): JSX.Element | null => {
                  let row: JSX.Element | null = null;
                  if (
                    shortAlias === coordinator ||
                    (federation.getCoordinator(shortAlias).enabled === true &&
                      federation.getCoordinator(shortAlias).info !== undefined)
                  ) {
                    row = (
                      <MenuItem key={shortAlias} value={shortAlias}>
                        <Typography>{federation.getCoordinator(shortAlias).longAlias}</Typography>
                      </MenuItem>
                    );
                  }
                  return row;
                })}
              </Select>
            </Grid>
          </Grid>
        </Box>
      </Tooltip>
    </Grid>
  );
};

export default SelectCoordinator;
