import { Pagination, Row } from 'antd';
import React, { useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { BsGrid3X2GapFill } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useCoreData } from '../hooks/useCoreData';
import { useEvent } from '../hooks/useEvent';
import { updateEvent, updateEventPage } from '../store/eventSlice';
import { updateSelectedMenu } from '../store/selectedMenuSlice';
import MatchView from './MatchView';

function HighLights() {
  const groupedData = useSelector((state) => state.Event.groupedData);
  const selectedEventGames = useSelector(
    (state) => state.Event.selectedEventGames
  );
  const coreData = useSelector((state) => state.coreData.coreData);
  const leagues = useSelector((state) => state.coreData.leagues);
  const market_filters = useSelector((state) => state.coreData.market_filters);
  const bet_types = useSelector((state) => state.coreData.bet_types);
  const eventDetailCatch = useSelector((state) => state.Event.eventDetailCatch);
  const config = useSelector((state) => state.configuration);

  const selectedPage = useSelector((state) => state.Event.selectedPage);
  const { getSportTypeLogo } = useEvent();
  const { getData } = useCoreData();
  const navigate = useNavigate();
  let { id } = useParams();
  const dispatch = useDispatch();

  const { i18n } = useTranslation();

  useEffect(() => {
    // console.log(selectedGameMenu);
    getData(1, id);
    dispatch(
      updateEvent({
        selectedSubGameList: '',
        highlightSportTypeId: id,
        Inplay: true,
      })
    );
    dispatch(
      updateSelectedMenu({
        selectedSubGameList: '',
        selectedGameList: '',
        activeMenuID: 5,
      })
    );
  }, [id]);
  const changePage = (page, pageSize) => {
    dispatch(updateEventPage({ selectedPage: page - 1 }));
  };

  const hasSomeDoubleChance = selectedEventGames.some(
    (g) => g.win_odds.length > 3
  );

  return (
    <>
      <div
        className="flex h-9  items-center bg-secondary-200 pr-2"
        onClick={() => {
          // console.log('change view to Type');
        }}
      >
        <div className="flex w-full items-center justify-center ">
          <span className="flex items-center text-2xl uppercase text-white ">
            Games
          </span>
        </div>
        <BsGrid3X2GapFill className=" h-6 w-8 cursor-pointer justify-end fill-gray-200 hover:fill-white" />
      </div>
      <div className="flex w-full flex-col  gap-y-1 ">
        {selectedEventGames
          ? selectedEventGames
              .map((g, i) => {
                if (i >= selectedPage * 5 && i <= selectedPage * 5 + 5) {
                  return (
                    <MatchView
                      coreData={coreData}
                      leagues={leagues}
                      bet_types={bet_types}
                      getSportTypeLogo={getSportTypeLogo}
                      market_filters={market_filters}
                      eventDetailCatch={eventDetailCatch}
                      lang={i18n.resolvedLanguage}
                      hasDoubleChance={hasSomeDoubleChance}
                      index={i}
                      key={i}
                      config={config}
                      g={g}
                      getEventDetail={(g) => {
                        navigate(`/match/detail/${g.id}`);
                      }}
                    />
                  );
                } else {
                  return null;
                }
              })
              .filter((gd) => gd != null)
          : ''}
      </div>
      <div className="flex justify-center">
        <Row className="fullTable">
          <center
            style={{ color: 'white', fontSize: '20px', marginTop: '15px' }}
          >
            {' '}
            <Pagination
              current={selectedPage + 1}
              total={groupedData && groupedData.length}
              pageSize={5}
              onChange={changePage}
            />{' '}
          </center>
        </Row>
      </div>
    </>
  );
}

export default HighLights;
