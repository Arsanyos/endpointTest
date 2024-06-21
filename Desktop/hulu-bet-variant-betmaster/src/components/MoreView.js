import { Col, Icon, Modal, Row, Spin, message } from 'antd';
import moment from 'moment';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

import howToPlay from '../assets/howToPlay.json';
import slip_ball_icon from '../assets/img/slip_ball_icon.png';
import LModel from '../services/api';
import ClientSession from '../services/client-session';
import FormatEntity from '../services/format_entity';
import Utils from '../services/utils';
import { useStore } from '../store';

const antIcon = (
  <Icon type="loading" style={{ color: '#e7dc3e', fontSize: 34 }} spin />
);
class MoreView extends Component {
  constructor(props) {
    super(props);
    this.grp = [];
    this.scrlMarket = {};
    this.state = {
      visibleMore: this.props.visibleMore || false,
      loading2: true,
      eventDetail: {},
      filterMarketByType: 'All',
      showHowToModal: false,
    };
  }

  componentDidMount() {
    this.getEventDetail(this.props.selectedEvent.id);
  }

  getSportTypeLogo = (leagueId) => {
    if (
      this.props.leagues &&
      this.props.leagues.length > 0 &&
      this.props.leagues[leagueId]
    ) {
      var stid = this.props.leagues[leagueId].sport_type;
      var st = this.props.sport_types[stid];
      return this.validURL(st.logo)
        ? st.logo
        : LModel.API_BASE_URL + '' + st.logo;
    } else {
      return slip_ball_icon;
    }
  };

  addToSlip = async (full, g, title, gameType, pick, matchId, oddId, odd) => {
    if (this.isAddedToSlip(oddId)) {
      this.removeSlip(oddId);
    } else {
      const s = useStore
        .getState()
        .slips[useStore.getState().selectedSlip].filter(
          (s) => s.matchId != matchId
        );

      if (s.length >= this.props.config.maxmatches) {
        return message.error(
          `${this.props.t('MaximumamountofMatchesis')} ${
            this.props.config.maxmatches
          }`,
          5
        );
      }

      var game = g;
      game.matchId = matchId;
      game.gleague = full.league;
      game.title = title;
      game.gameType = gameType;
      game.pick = pick;
      game.id = oddId;
      game.odd = odd;
      s.push(game);
      let newSlips = { ...useStore.getState().slips };
      newSlips[useStore.getState().selectedSlip] = s;

      useStore.getState().setSlips(newSlips);

      ClientSession.storeSlip(newSlips, (err) => {});
      ClientSession.storeSlipLastUpdate(moment(new Date()), (err) => {});
    }
  };
  removeSlip = (id) => {
    let s = useStore
      .getState()
      .slips[useStore.getState().selectedSlip].filter((s) => s.id != id);
    let newSlips = { ...useStore.getState().slips };
    newSlips[useStore.getState().selectedSlip] = s;
    useStore.getState().setSlips(newSlips);

    ClientSession.storeSlip(newSlips, (err) => {});
    ClientSession.storeSlipLastUpdate(moment(new Date()), (err) => {});
  };
  getBetTypeName = (btid) => {
    if (!this.props.bet_types) return 'empty';
    let lg = this.props.bet_types[btid];
    return lg.name;
  };

  verifyOddType = (bet_type, type) => {
    let name = this.getBetTypeName(bet_type);

    if (type == 'HOME') {
      if (name == '{$competitor1}' || name == '1') {
        return true;
      } else {
        return false;
      }
    } else if (type == 'AWAY') {
      if (name == '{$competitor2}' || name == '2') {
        return true;
      } else {
        return false;
      }
    } else if (type == 'DRAW') {
      if (name.toLowerCase() == 'draw') {
        return true;
      } else {
        return false;
      }
    }
  };

  localizeBetTypes = (id, value) => {
    if (this.props.lang == 'Am') {
      if (this.props.bet_types[id].locales.filter((l) => l.locale == 1)[0]) {
        return this.props.bet_types[id].locales.filter((l) => l.locale == 1)[0]
          .translation;
      } else {
        return value;
      }
    } else {
      return value;
    }
  };

  isAddedToSlip = (id) => {
    // return false
    if (
      useStore
        .getState()
        .slips[useStore.getState().selectedSlip].filter((s) => s.id == id)
        .length == 0
    ) {
      return false;
    } else {
      return true;
    }
  };

  localizeBetGroups = (id, value) => {
    // console.log(id,value)
    if (this.props.lang == 'Am') {
      if (
        this.props.bet_groups &&
        this.props.bet_groups[id] &&
        this.props.bet_groups[id].locales.filter((l) => l.locale == 1)[0]
      ) {
        console.log(this.props.bet_groups[id].locales);
        return this.props.bet_groups[id].locales.filter((l) => l.locale == 1)[0]
          .translation;
      } else {
        return value;
      }
    } else {
      return value;
    }
  };

  scrollIntoViewElmt = (key) => {
    const objDiv = document.getElementById(key);
    // if(objDiv!=null) objDiv.scrollTop = objDiv.scrollHeight;
    if (objDiv != null && this.state.visibleMore) {
      // console.log(objDiv);
      objDiv.scrollIntoView({ block: 'start' });
      clearInterval(this.scrlMarket.current);
      // this.scrlMarket.current=null;
    }
  };

  showHowTo = (groupId) => {
    this.setState({ howToId: groupId, showHowToModal: true });
  };
  getEventDetail = (id) => {
    if (this.props.eventDetailCatch[id] != null) {
      this.setState({
        eventDetail: this.props.eventDetailCatch[id],
        selectedEvent: this.props.eventDetailCatch[id],
      });
      return this.props.eventDetailCatch[id];
    }
    this.setState({ loading2: true });
    LModel.findWithNoToken(
      `sport-data/matches/${id}/?ln=${this.props.lang.toLowerCase()}`,
      null,
      null
    )
      .then((response) => {
        if (response.data) {
          var r = response.data;
          var i = r.items.sort((a, b) =>
            a.bet_group.order < b.bet_group.order ? -1 : 1
          );
          r.items = i;
          var edc = { ...this.props.eventDetailCatch };
          edc[id] = r;
          this.setState({ loading2: false });
          this.setState({
            eventDetail: r,
            eventDetailCatch: edc,
            selectedEvent: r,
          });
          r.items.map((i, k) => {
            const marketpick = process.env.REACT_ABBREVIATE == 'true'
            ? Utils.replaceMarketNameShort(
                localizeBetGroups(i.bet_group.id, i.bet_group.name),
                i.param,
                selectedEvent.hom,
                selectedEvent.awy,
                selectedEvent.hometeam_locale,
                selectedEvent.awayteam_locale,
                i18n.resolvedLanguage
              )
            : Utils.replaceMarketName(
                localizeBetGroups(i.bet_group.id, i.bet_group.name),
                i.param,
                selectedEvent.hom,
                selectedEvent.awy,
                selectedEvent.hometeam_locale,
                selectedEvent.awayteam_locale,
                i18n.resolvedLanguage
              );
            let marketType =
              Object.values(i.specifier).length != 0
                ? FormatEntity.formatMarketName(marketpick, null, i.specifier)
                : FormatEntity.formatMarketName(
                    marketpick,
                    this.state.selectedEvent,
                    i.specifier
                  );
            // console.log(marketType);
            // TODO: Implement  How to play json group ID
            // this.setGameId(marketType,i.bet_group.id)
          });
        }
      })
      .catch((err) => {
        // console.log(err);
        if (!err.response || !err.response.data) {
          return message.error('Error While Loading Data');
        }
        message.error(
          err.response.data[Object.keys(err.response.data)[0]][0],
          5
        );
        this.setState({ loading2: false });
      });
  };

  render() {
    return (
      <>
        <Modal
          title={
            <div style={{ color: '#4CAF50', fontWeight: 500 }}>
              <center style={{ fontSize: '22px', marginBottom: 5 }}>
                {this.props.selectedEvent &&
                this.props.selectedEvent.league &&
                this.props.selectedEvent.league.id ? (
                  <>
                    <img
                      src={
                        this.props.league_groups[
                          this.props.selectedEvent.league.league_group
                        ].logo
                      }
                      width={22}
                      height={18}
                    />{' '}
                    <img
                      src={this.props.getSportTypeLogo(
                        this.props.selectedEvent.league.id
                      )}
                      width={22}
                      height={22}
                    />
                  </>
                ) : (
                  ''
                )}{' '}
                {this.props.selectedEvent.league &&
                this.props.selectedEvent.league.name
                  ? this.props.selectedEvent.league.name
                  : ''}
              </center>
              <center style={{ fontSize: '22px' }}>
                {this.props.selectedEvent &&
                this.props.selectedEvent.hometeam_locale == null &&
                this.props.selectedEvent.hom == null
                  ? ''
                  : (this.props.lang == 'Am' &&
                    this.props.selectedEvent.hometeam_locale != null
                      ? this.props.selectedEvent.hometeam_locale
                      : this.props.selectedEvent.hom) +
                    ' ' +
                    this.props.t('VS') +
                    ' ' +
                    (this.props.lang == 'Am' &&
                    this.props.selectedEvent.awayteam_locale
                      ? this.props.selectedEvent.awayteam_locale
                      : this.props.selectedEvent.awy)}
              </center>
              <center>
                {this.props.selectedEvent && this.props.selectedEvent.schedule
                  ? Utils.displayTime(
                      this.props.selectedEvent.schedule,
                      this.props.lang
                    )
                  : ''}
              </center>
            </div>
          }
          width={900}
          visible={this.state.visibleMore}
          onOk={() => {
            this.setState({ visibleMore: !this.state.visibleMore });
            this.grp = [];
          }}
          onCancel={() => {
            this.setState({
              visibleMore: !this.state.visibleMore,
              filterMarketByType: 'All',
            });
            this.grp = [];
            this.props.onToggle(false);
          }}
          style={{ padding: '0px' }}
          afterClose={() => {
            this.grp = [];
          }}
          destroyOnClose={true}
          className="noPad5"
          footer={[]}
        >
          <div className="marketContainer" style={{ display: 'none' }}>
            {(this.grp = [])}
          </div>
          <Row>
            <div className="horizontalMenu mainMenus" style={{ height: 32 }}>
              <div
                span="2"
                className={
                  'horizontalMenuItem show-any ' +
                  (this.state.filterMarketByType == 'All' ? 'active' : '')
                }
                style={{
                  height: 32,
                  width: 100,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={() => {
                  this.setState({ filterMarketByType: 'All' }, () => {});
                }}
              >
                <span
                  style={{
                    color: 'white',
                    paddingLeft: 5,
                    fontSize: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {this.props.t('All')}
                </span>
              </div>
              <div
                span="2"
                className={
                  'horizontalMenuItem show-any ' +
                  (this.state.filterMarketByType == 1 ? 'active' : '')
                }
                style={{
                  height: 32,
                  width: 100,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={() => {
                  this.setState({ filterMarketByType: 1 }, () => {});
                }}
              >
                <span
                  style={{
                    color: 'white',
                    paddingLeft: 5,
                    fontSize: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {this.props.t('Main') + ' ' + this.props.t('Market')}
                </span>
              </div>
              <div
                span="2"
                className={
                  'horizontalMenuItem show-any ' +
                  (this.state.filterMarketByType == 2 ? 'active' : '')
                }
                style={{
                  height: 32,
                  width: 100,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={() => {
                  this.setState({ filterMarketByType: 2 }, () => {});
                }}
              >
                <span
                  style={{
                    color: 'white',
                    paddingLeft: 5,
                    fontSize: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {this.props.t('Total')}
                </span>
              </div>
              <div
                span="2"
                className={
                  'horizontalMenuItem show-any ' +
                  (this.state.filterMarketByType == 4 ? 'active' : '')
                }
                style={{
                  height: 32,
                  width: 100,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={() => {
                  this.setState({ filterMarketByType: 4 }, () => {});
                }}
              >
                <span
                  style={{
                    color: 'white',
                    paddingLeft: 5,
                    fontSize: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {this.props.t('HalfTime')}
                </span>
              </div>
              <div
                span="2"
                className={
                  'horizontalMenuItem show-any ' +
                  (this.state.filterMarketByType == 3 ? 'active' : '')
                }
                style={{
                  height: 32,
                  width: 100,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={() => {
                  this.setState({ filterMarketByType: 3 }, () => {});
                }}
              >
                <span
                  style={{
                    color: 'white',
                    paddingLeft: 5,
                    fontSize: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {this.props.t('Combinations')}
                </span>
              </div>
              <div
                span="2"
                className={
                  'horizontalMenuItem show-any ' +
                  (this.state.filterMarketByType == 5 ? 'active' : '')
                }
                style={{
                  height: 32,
                  width: 100,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={() => {
                  this.setState({ filterMarketByType: 5 }, () => {});
                }}
              >
                <span
                  style={{
                    color: 'white',
                    paddingLeft: 5,
                    fontSize: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {this.props.t('Handicaps')}
                </span>
              </div>
            </div>
          </Row>
          <Row style={{ backgroundColor: '#263238', padding: '5px' }}>
            {!this.state.loading2 ? (
              this.state.eventDetail.items ? (
                this.state.eventDetail.items.map((i, k) => {
                  if (
                    this.state.filterMarketByType != 'All' &&
                    !this.props.market_filters[
                      this.state.filterMarketByType
                    ].includes(i.bet_group.id)
                  ) {
                    return null;
                  }

                  if (
                    this.grp.includes(i.bet_group.id) &&
                    i.bet_group.hasParam == false
                  ) {
                    return (
                      <Row key={'evDetZ' + k}>
                        <Col
                          span={24}
                          style={{
                            backgroundColor: '#37474f',
                            borderBottom: '2px solid #37474f',
                            borderTopRightRadius: '0px',
                            borderTopLeftRadius: '0px',
                          }}
                        >
                          <Row>
                            {i.odds
                              ? i.odds
                                  .sort((a, b) =>
                                    a.bet_type.order > b.bet_type.order ? 1 : -1
                                  )
                                  .map((o, k) => {
                                    const betType = process.env.REACT_ABBREVIATE == 'true'? Utils.replaceNameShort(
                                      this.localizeBetTypes(
                                        o.bet_type.id,
                                        o.bet_type.name
                                      ),
                                      i.param,
                                      this.props.selectedEvent.hom,
                                      this.props.selectedEvent.awy,
                                      this.props.selectedEvent.hometeam_locale,
                                      this.props.selectedEvent.awayteam_locale
                                    ):Utils.replaceName(
                                      this.localizeBetTypes(
                                        o.bet_type.id,
                                        o.bet_type.name
                                      ),
                                      i.param,
                                      this.props.selectedEvent.hom,
                                      this.props.selectedEvent.awy,
                                      this.props.selectedEvent.hometeam_locale,
                                      this.props.selectedEvent.awayteam_locale
                                    );
                                    const formatedBetType =
                                      FormatEntity.formatPickName(
                                        betType,
                                        null,
                                        o.item.specifier
                                      );
                                    const formatedGroupType =
                                      FormatEntity.formatMarketName(
                                        o.bet_group.name,
                                        Object.values(o.item.specifier).length >
                                          0
                                          ? this.props.selectedEvent
                                          : null,
                                        o.item.specifier
                                      );
                                    const betgroup =  process.env.REACT_ABBREVIATE == 'true'?Utils.replaceNameShort(
                                      formatedGroupType,
                                      o.item && o.item.param
                                        ? o.item.param
                                        : '',
                                      this.props.selectedEvent.hom,
                                      this.props.selectedEvent.awy
                                    ):Utils.replaceName(
                                      formatedGroupType,
                                      o.item && o.item.param
                                        ? o.item.param
                                        : '',
                                      this.props.selectedEvent.hom,
                                      this.props.selectedEvent.awy
                                    );
                                    // let pick = Utils.replaceName(this.localizeBetTypes(o.bet_type.id, o.bet_type.name), i.param, this.props.selectedEvent.hom, this.props.selectedEvent.awy, this.props.selectedEvent.hometeam_locale, this.props.selectedEvent.awayteam_locale);
                                    // const formatedPickName = Object.values(o.item.specifier).length != 0 ? FormatEntity.formatPickName(pick, null, o.item.specifier) : FormatEntity.formatPickName(pick, this.props.selectedEvent, o.item.specifier)
                                    if (i.odds.length == 1) {
                                      // TODO: Scroll to selected market
                                      if (this.isAddedToSlip(o.id)) {
                                        this.scrlMarket.current = setTimeout(
                                          () =>
                                            this.scrollIntoViewElmt(
                                              'pick1' + k
                                            ),
                                          1000
                                        );
                                      }
                                      var title =
                                        (this.props.lang == 'Am' &&
                                        this.props.selectedEvent
                                          .hometeam_locale != null
                                          ? this.props.selectedEvent
                                              .hometeam_locale
                                          : this.props.selectedEvent.hom) +
                                        ' ' +
                                        this.props.t('VS') +
                                        ' ' +
                                        (this.props.lang == 'Am' &&
                                        this.props.selectedEvent.awayteam_locale
                                          ? this.props.selectedEvent
                                              .awayteam_locale
                                          : this.props.selectedEvent.awy);
                                      // var gameType = Utils.replaceName(this.localizeBetGroups(i.bet_group.id, i.bet_group.name), i.param, this.props.selectedEvent.hom, this.props.selectedEvent.awy, this.props.selectedEvent.hometeam_locale, this.props.selectedEvent.awayteam_locale)

                                      return (
                                        <Col
                                          key={'pick1' + k}
                                          span={24}
                                          className={'tableitem'}
                                          onClick={() => {
                                            this.addToSlip(
                                              i,
                                              i,
                                              title,
                                              betgroup,
                                              formatedBetType,
                                              i.match,
                                              o.id,
                                              o.odd
                                            );
                                            this.setState({
                                              visibleMore: false,
                                            });
                                            this.props.onToggle(false);
                                          }}
                                          style={
                                            this.isAddedToSlip(o.id)
                                              ? {
                                                  backgroundColor: '#1a76d2',
                                                  borderLeft:
                                                    '2px solid #37474f',
                                                  borderRight:
                                                    '2px solid #37474f',
                                                }
                                              : {
                                                  backgroundColor: '#546e7a',
                                                  borderLeft:
                                                    '2px solid #37474f',
                                                  borderRight:
                                                    '2px solid #37474f',
                                                }
                                          }
                                        >
                                          <Row
                                            style={{
                                              color: 'white',
                                              width: '100%',
                                              paddingTop: '6px',
                                              paddingLeft: '5px',
                                              fontWeight: 500,
                                            }}
                                          >
                                            <Col
                                              span={18}
                                              style={{
                                                height: '23px',
                                                display: 'inline-block',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                float: 'left',
                                              }}
                                            >
                                              {process.env.REACT_ABBREVIATE ==
                                              'true'
                                                ? Utils.capitalizePicksShort(
                                                    formatedBetType
                                                  )
                                                : Utils.capitalizePicks(
                                                    formatedBetType
                                                  )}
                                            </Col>
                                            <Col
                                              span={4}
                                              className={'tableitemPrice'}
                                            >
                                              <span
                                                id={'pick1' + k}
                                                className={'tableitemPrice'}
                                              >
                                                {o.odd}
                                              </span>
                                            </Col>
                                          </Row>
                                        </Col>
                                      );
                                    } else if (i.odds.length == 2) {
                                      // TODO: Scroll to selected market
                                      if (this.isAddedToSlip(o.id)) {
                                        this.scrlMarket.current = setTimeout(
                                          () =>
                                            this.scrollIntoViewElmt(
                                              'pick2' + k
                                            ),
                                          1000
                                        );
                                      }
                                      var title =
                                        (this.props.lang == 'Am' &&
                                        this.props.selectedEvent
                                          .hometeam_locale != null
                                          ? this.props.selectedEvent
                                              .hometeam_locale
                                          : this.props.selectedEvent.hom) +
                                        ' ' +
                                        this.props.t('VS') +
                                        ' ' +
                                        (this.props.lang == 'Am' &&
                                        this.props.selectedEvent.awayteam_locale
                                          ? this.props.selectedEvent
                                              .awayteam_locale
                                          : this.props.selectedEvent.awy);
                                      // var gameType = Utils.replaceName(this.localizeBetGroups(i.bet_group.id, i.bet_group.name), i.param, this.props.selectedEvent.hom, this.props.selectedEvent.awy, this.props.selectedEvent.hometeam_locale, this.props.selectedEvent.awayteam_locale)

                                      return (
                                        <Col
                                          key={'pick2' + k}
                                          span={12}
                                          className={'tableitem'}
                                          onClick={() => {
                                            this.addToSlip(
                                              i,
                                              i,
                                              title,
                                              betgroup,
                                              formatedBetType,
                                              i.match,
                                              o.id,
                                              o.odd
                                            );
                                            this.setState({
                                              visibleMore: false,
                                            });
                                            this.props.onToggle(false);
                                          }}
                                          style={
                                            this.isAddedToSlip(o.id)
                                              ? {
                                                  backgroundColor: '#1a76d2',
                                                  borderLeft:
                                                    '2px solid #37474f',
                                                  borderRight:
                                                    '2px solid #37474f',
                                                }
                                              : {
                                                  backgroundColor: '#546e7a',
                                                  borderLeft:
                                                    '2px solid #37474f',
                                                  borderRight:
                                                    '2px solid #37474f',
                                                }
                                          }
                                        >
                                          <Row
                                            style={{
                                              color: 'white',
                                              width: '100%',
                                              paddingTop: '6px',
                                              paddingLeft: '5px',
                                              fontWeight: 500,
                                            }}
                                          >
                                            <Col
                                              span={18}
                                              style={{
                                                height: '23px',
                                                display: 'inline-block',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                float: 'left',
                                              }}
                                            >
                                              {process.env.REACT_ABBREVIATE ==
                                              'true'
                                                ? Utils.capitalizePicksShort(
                                                    formatedBetType
                                                  )
                                                : Utils.capitalizePicks(
                                                    formatedBetType
                                                  )}
                                            </Col>
                                            <Col
                                              span={4}
                                              className={'tableitemPrice'}
                                            >
                                              <span
                                                id={'pick2' + k}
                                                className={'tableitemPrice'}
                                              >
                                                {o.odd}
                                              </span>
                                            </Col>
                                          </Row>
                                        </Col>
                                      );
                                    } else {
                                      // TODO: Scroll to selected market
                                      if (this.isAddedToSlip(o.id)) {
                                        this.scrlMarket.current = setTimeout(
                                          () =>
                                            this.scrollIntoViewElmt(
                                              'pick3' + k
                                            ),
                                          1000
                                        );
                                      }
                                      var title =
                                        (this.props.lang == 'Am' &&
                                        this.props.selectedEvent
                                          .hometeam_locale != null
                                          ? this.props.selectedEvent
                                              .hometeam_locale
                                          : this.props.selectedEvent.hom) +
                                        ' ' +
                                        this.props.t('VS') +
                                        ' ' +
                                        (this.props.lang == 'Am' &&
                                        this.props.selectedEvent.awayteam_locale
                                          ? this.props.selectedEvent
                                              .awayteam_locale
                                          : this.props.selectedEvent.awy);
                                      // var gameType = Utils.replaceName(this.localizeBetGroups(i.bet_group.id, i.bet_group.name), i.param, this.props.selectedEvent.hom, this.props.selectedEvent.awy, this.props.selectedEvent.hometeam_locale, this.props.selectedEvent.awayteam_locale)

                                      return (
                                        <Col
                                          key={'pick3' + k}
                                          span={8}
                                          className={'tableitem'}
                                          onClick={() => {
                                            this.addToSlip(
                                              i,
                                              i,
                                              title,
                                              betgroup,
                                              formatedBetType,
                                              i.match,
                                              o.id,
                                              o.odd
                                            );
                                            this.setState({
                                              visibleMore: false,
                                            });
                                            this.props.onToggle(false);
                                          }}
                                          style={
                                            this.isAddedToSlip(o.id)
                                              ? {
                                                  backgroundColor: '#1a76d2',
                                                  borderLeft:
                                                    '2px solid #37474f',
                                                  borderRight:
                                                    '2px solid #37474f',
                                                  borderBottom:
                                                    '2px solid #37474f',
                                                }
                                              : {
                                                  backgroundColor: '#546e7a',
                                                  borderLeft:
                                                    '2px solid #37474f',
                                                  borderRight:
                                                    '2px solid #37474f',
                                                  borderBottom:
                                                    '2px solid #37474f',
                                                }
                                          }
                                        >
                                          <Row
                                            style={{
                                              color: 'white',
                                              width: '100%',
                                              paddingTop: '6px',
                                              paddingLeft: '5px',
                                              fontWeight: 500,
                                            }}
                                          >
                                            <Col
                                              span={18}
                                              style={{
                                                height: '23px',
                                                display: 'inline-block',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                float: 'left',
                                              }}
                                            >
                                              {process.env.REACT_ABBREVIATE ==
                                              'true'
                                                ? Utils.capitalizePicksShort(
                                                    formatedBetType
                                                  )
                                                : Utils.capitalizePicks(
                                                    formatedBetType
                                                  )}
                                            </Col>
                                            <Col
                                              span={4}
                                              className={'tableitemPrice'}
                                            >
                                              <span
                                                id={'pick3' + k}
                                                className={'tableitemPrice'}
                                              >
                                                {o.odd}
                                              </span>
                                            </Col>
                                          </Row>
                                        </Col>
                                      );
                                    }
                                  })
                              : ''}
                          </Row>
                        </Col>
                      </Row>
                    );
                  } else {
                    this.grp.push(i.bet_group.id);
                    const marketpick = process.env.REACT_ABBREVIATE == 'true'
                    ? Utils.replaceMarketNameShort(
                        localizeBetGroups(i.bet_group.id, i.bet_group.name),
                        i.param,
                        selectedEvent.hom,
                        selectedEvent.awy,
                        selectedEvent.hometeam_locale,
                        selectedEvent.awayteam_locale,
                        i18n.resolvedLanguage
                      )
                    : Utils.replaceMarketName(
                        localizeBetGroups(i.bet_group.id, i.bet_group.name),
                        i.param,
                        selectedEvent.hom,
                        selectedEvent.awy,
                        selectedEvent.hometeam_locale,
                        selectedEvent.awayteam_locale,
                        i18n.resolvedLanguage
                      );
                    let marketType =
                      Object.values(i.specifier).length != 0
                        ? FormatEntity.formatMarketName(
                            marketpick,
                            null,
                            i.specifier
                          )
                        : FormatEntity.formatMarketName(
                            marketpick,
                            this.props.selectedEvent,
                            i.specifier
                          );
                    if (marketType.includes('Handicap')) {
                      marketType = marketType.slice(0, -3);
                    }
                    return (
                      <Row key={'evDet2' + k}>
                        <Col
                          span={24}
                          style={{
                            backgroundColor: '#37474f',
                            borderBottom: '2px solid #37474f',
                            borderTopRightRadius: '0px',
                            borderTopLeftRadius: '0px',
                          }}
                        >
                          <Row style={{ backgroundColor: '#263238' }}>
                            <Col span={12}>
                              <center
                                style={{
                                  color: 'white',
                                  width: '100%',
                                  paddingTop: '6px',
                                  fontWeight: 500,
                                }}
                              >
                                {marketType}
                              </center>
                            </Col>
                            <Col span={6}>
                              <center
                                style={{
                                  color: 'white',
                                  width: '100%',
                                  paddingTop: '6px',
                                  fontWeight: 500,
                                }}
                              >
                                ID : {i.id}
                              </center>
                            </Col>
                            <Col
                              span={6}
                              onClick={() => {
                                this.showHowTo(i.bet_group.id);
                                this.grp = [];
                              }}
                            >
                              <center
                                style={{
                                  color: '#339ce5',
                                  width: '100%',
                                  paddingTop: '6px',
                                  fontWeight: 500,
                                  cursor: 'pointer',
                                }}
                              >
                                {this.props.t('Howtoplay')}{' '}
                              </center>
                            </Col>
                          </Row>
                          <Row>
                            {i.odds
                              ? i.odds
                                  .sort((a, b) =>
                                    a.bet_type.order > b.bet_type.order ? 1 : -1
                                  )
                                  .map((o, k) => {
                                    const betType =process.env.REACT_ABBREVIATE == 'true'? Utils.replaceNameShort(
                                      this.localizeBetTypes(
                                        o.bet_type.id,
                                        o.bet_type.name
                                      ),
                                      i.param,
                                      this.props.selectedEvent.hom,
                                      this.props.selectedEvent.awy,
                                      this.props.selectedEvent.hometeam_locale,
                                      this.props.selectedEvent.awayteam_locale
                                    ):Utils.replaceName(
                                      this.localizeBetTypes(
                                        o.bet_type.id,
                                        o.bet_type.name
                                      ),
                                      i.param,
                                      this.props.selectedEvent.hom,
                                      this.props.selectedEvent.awy,
                                      this.props.selectedEvent.hometeam_locale,
                                      this.props.selectedEvent.awayteam_locale
                                    );
                                    const formatedBetType =
                                      FormatEntity.formatPickName(
                                        betType,
                                        null,
                                        o.item.specifier
                                      );
                                    const formatedGroupType =
                                      FormatEntity.formatMarketName(
                                        o.bet_group.name,
                                        Object.values(o.item.specifier).length >
                                          0
                                          ? this.props.selectedEvent
                                          : null,
                                        o.item.specifier
                                      );
                                    const betgroup = process.env.REACT_ABBREVIATE == 'true'?Utils.replaceNameShort(
                                      formatedGroupType,
                                      o.item && o.item.param
                                        ? o.item.param
                                        : '',
                                      this.props.selectedEvent.hom,
                                      this.props.selectedEvent.awy
                                    ): Utils.replaceName(
                                      formatedGroupType,
                                      o.item && o.item.param
                                        ? o.item.param
                                        : '',
                                      this.props.selectedEvent.hom,
                                      this.props.selectedEvent.awy
                                    );
                                    
                                    // const formatedPickName = Object.values(o.item.specifier).length != 0 ? FormatEntity.formatPickName(pick, null, o.item.specifier) : FormatEntity.formatPickName(pick, this.props.selectedEvent, o.item.specifier)
                                    if (i.odds.length == 1) {
                                      if (this.isAddedToSlip(o.id)) {
                                        this.scrlMarket.current = setTimeout(
                                          () =>
                                            this.scrollIntoViewElmt(
                                              'pick1x' + k
                                            ),
                                          1000
                                        );
                                      }
                                      var title =
                                        (this.props.lang == 'Am' &&
                                        this.props.selectedEvent
                                          .hometeam_locale != null
                                          ? this.props.selectedEvent
                                              .hometeam_locale
                                          : this.props.selectedEvent.hom) +
                                        ' ' +
                                        this.props.t('VS') +
                                        ' ' +
                                        (this.props.lang == 'Am' &&
                                        this.props.selectedEvent.awayteam_locale
                                          ? this.props.selectedEvent
                                              .awayteam_locale
                                          : this.props.selectedEvent.awy);
                                      // var gameType = Utils.replaceName(this.localizeBetGroups(i.bet_group.id, i.bet_group.name), i.param, this.props.selectedEvent.hom, this.props.selectedEvent.awy, this.props.selectedEvent.hometeam_locale, this.props.selectedEvent.awayteam_locale)

                                      return (
                                        <Col
                                          key={'pick1x' + k}
                                          span={24}
                                          className={'tableitem'}
                                          onClick={() => {
                                            this.addToSlip(
                                              i,
                                              i,
                                              title,
                                              betgroup,
                                              formatedBetType,
                                              i.match,
                                              o.id,
                                              o.odd
                                            );
                                            this.setState({
                                              visibleMore: false,
                                            });
                                            this.props.onToggle(false);
                                          }}
                                          style={
                                            this.isAddedToSlip(o.id)
                                              ? {
                                                  backgroundColor: '#1a76d2',
                                                  borderLeft:
                                                    '2px solid #37474f',
                                                  borderRight:
                                                    '2px solid #37474f',
                                                }
                                              : {
                                                  backgroundColor: '#546e7a',
                                                  borderLeft:
                                                    '2px solid #37474f',
                                                  borderRight:
                                                    '2px solid #37474f',
                                                }
                                          }
                                        >
                                          <Row
                                            style={{
                                              color: 'white',
                                              width: '100%',
                                              paddingTop: '6px',
                                              paddingLeft: '5px',
                                              fontWeight: 500,
                                            }}
                                          >
                                            <Col
                                              span={18}
                                              style={{
                                                height: '23px',
                                                display: 'inline-block',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                float: 'left',
                                              }}
                                            >
                                              {formatedBetType}
                                            </Col>
                                            <Col
                                              span={4}
                                              className={'tableitemPrice'}
                                            >
                                              <span
                                                id={'pick1x' + k}
                                                className={'tableitemPrice'}
                                              >
                                                {o.odd}
                                              </span>
                                            </Col>
                                          </Row>
                                        </Col>
                                      );
                                    } else if (i.odds.length == 2) {
                                      // TODO: Scroll to selected market
                                      if (this.isAddedToSlip(o.id)) {
                                        this.scrlMarket.current = setTimeout(
                                          () =>
                                            this.scrollIntoViewElmt(
                                              'pick2x' + k
                                            ),
                                          1000
                                        );
                                      }
                                      var title =
                                        (this.props.lang == 'Am' &&
                                        this.props.selectedEvent
                                          .hometeam_locale != null
                                          ? this.props.selectedEvent
                                              .hometeam_locale
                                          : this.props.selectedEvent.hom) +
                                        ' ' +
                                        this.props.t('VS') +
                                        ' ' +
                                        (this.props.lang == 'Am' &&
                                        this.props.selectedEvent.awayteam_locale
                                          ? this.props.selectedEvent
                                              .awayteam_locale
                                          : this.props.selectedEvent.awy);
                                      // var gameType = Utils.replaceName(this.localizeBetGroups(i.bet_group.id, i.bet_group.name), i.param, this.props.selectedEvent.hom, this.props.selectedEvent.awy, this.props.selectedEvent.hometeam_locale, this.props.selectedEvent.awayteam_locale)
                                      return (
                                        <Col
                                          key={'pick2x' + k}
                                          span={12}
                                          className={'tableitem'}
                                          onClick={() => {
                                            this.addToSlip(
                                              i,
                                              i,
                                              title,
                                              betgroup,
                                              formatedBetType,
                                              i.match,
                                              o.id,
                                              o.odd
                                            );
                                            this.setState({
                                              visibleMore: false,
                                            });
                                            this.props.onToggle(false);
                                          }}
                                          style={
                                            this.isAddedToSlip(o.id)
                                              ? {
                                                  backgroundColor: '#1a76d2',
                                                  borderLeft:
                                                    '2px solid #37474f',
                                                  borderRight:
                                                    '2px solid #37474f',
                                                }
                                              : {
                                                  backgroundColor: '#546e7a',
                                                  borderLeft:
                                                    '2px solid #37474f',
                                                  borderRight:
                                                    '2px solid #37474f',
                                                }
                                          }
                                        >
                                          <Row
                                            style={{
                                              color: 'white',
                                              width: '100%',
                                              paddingTop: '6px',
                                              paddingLeft: '5px',
                                              fontWeight: 500,
                                            }}
                                          >
                                            <Col
                                              span={18}
                                              style={{
                                                height: '23px',
                                                display: 'inline-block',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                float: 'left',
                                              }}
                                            >
                                              {formatedBetType}
                                            </Col>
                                            <Col
                                              span={4}
                                              className={'tableitemPrice'}
                                            >
                                              <span
                                                id={'pick2x' + k}
                                                className={'tableitemPrice'}
                                              >
                                                {o.odd}
                                              </span>
                                            </Col>
                                          </Row>
                                        </Col>
                                      );
                                    } else {
                                      if (this.isAddedToSlip(o.id)) {
                                        this.scrlMarket.current = setTimeout(
                                          () =>
                                            this.scrollIntoViewElmt(
                                              'pick3x' + k
                                            ),
                                          1000
                                        );
                                      }
                                      var title =
                                        (this.props.lang == 'Am' &&
                                        this.props.selectedEvent
                                          .hometeam_locale != null
                                          ? this.props.selectedEvent
                                              .hometeam_locale
                                          : this.props.selectedEvent.hom) +
                                        ' ' +
                                        this.props.t('VS') +
                                        ' ' +
                                        (this.props.lang == 'Am' &&
                                        this.props.selectedEvent.awayteam_locale
                                          ? this.props.selectedEvent
                                              .awayteam_locale
                                          : this.props.selectedEvent.awy);
                                      // var gameType = Utils.replaceName(this.localizeBetGroups(i.bet_group.id, i.bet_group.name), i.param, this.props.selectedEvent.hom, this.props.selectedEvent.awy, this.props.selectedEvent.hometeam_locale, this.props.selectedEvent.awayteam_locale)
                                      // pick = {process.env.REACT_ABBREVIATE=='true'?Utils.capitalizePicksShort(pick):Utils.capitalizePicks(pick
)}
                                      return (
                                        <Col
                                          key={'pick3x' + k}
                                          span={8}
                                          className={'tableitem'}
                                          onClick={() => {
                                            this.addToSlip(
                                              i,
                                              i,
                                              title,
                                              betgroup,
                                              formatedBetType,
                                              i.match,
                                              o.id,
                                              o.odd
                                            );
                                            this.setState({
                                              visibleMore: false,
                                            });
                                            this.props.onToggle(false);
                                          }}
                                          style={
                                            this.isAddedToSlip(o.id)
                                              ? {
                                                  backgroundColor: '#1a76d2',
                                                  borderLeft:
                                                    '2px solid #37474f',
                                                  borderRight:
                                                    '2px solid #37474f',
                                                  borderBottom:
                                                    '2px solid #37474f',
                                                }
                                              : {
                                                  backgroundColor: '#546e7a',
                                                  borderLeft:
                                                    '2px solid #37474f',
                                                  borderRight:
                                                    '2px solid #37474f',
                                                  borderBottom:
                                                    '2px solid #37474f',
                                                }
                                          }
                                        >
                                          <Row
                                            style={{
                                              color: 'white',
                                              width: '100%',
                                              paddingTop: '6px',
                                              paddingLeft: '5px',
                                              fontWeight: 500,
                                            }}
                                          >
                                            <Col
                                              span={18}
                                              style={{
                                                height: '23px',
                                                display: 'inline-block',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                float: 'left',
                                              }}
                                            >
                                              {/* {formatedBetType} */}
                                              {process.env.REACT_ABBREVIATE=='true'?Utils.capitalizePicksShort(formatedBetType):Utils.capitalizePicks(formatedBetType)}
                                            </Col>
                                            <Col
                                              span={4}
                                              className={'tableitemPrice'}
                                            >
                                              <span
                                                id={'pick3x' + k}
                                                className={'tableitemPrice'}
                                              >
                                                {o.odd}
                                              </span>
                                            </Col>
                                          </Row>
                                        </Col>
                                      );
                                    }
                                  })
                              : ''}
                          </Row>
                        </Col>
                      </Row>
                    );
                  }
                })
              ) : (
                ''
              )
            ) : (
              <center>
                <Spin indicator={antIcon} size="large" />
              </center>
            )}
          </Row>
        </Modal>
        <Modal
          title={this.props.t('Howtoplay')}
          visible={this.state.showHowToModal}
          onOk={() => {
            this.setState({ showHowToModal: !this.state.showHowToModal });
            this.grp = [];
          }}
          onCancel={() => {
            this.setState({ showHowToModal: !this.state.showHowToModal });
            this.grp = [];
          }}
          footer={[]}
        >
          {howToPlay[this.state.howToId] &&
          howToPlay[this.state.howToId][this.props.lang] ? (
            <div>
              <center>
                <h5>{howToPlay[this.state.howToId][this.props.lang].title}</h5>
              </center>
              <center>
                <small>
                  <b>
                    {howToPlay[this.state.howToId][this.props.lang].description}
                  </b>
                </small>
              </center>
              <br />
              <Row>
                {howToPlay[this.state.howToId][this.props.lang].options.map(
                  (o, i) => {
                    return (
                      <Col
                        key={'how' + i}
                        span={
                          howToPlay[this.state.howToId][this.props.lang].options
                            .lenght < 3
                            ? 12
                            : 8
                        }
                      >
                        {o}
                      </Col>
                    );
                  }
                )}
              </Row>
              <br />
              <p>{howToPlay[this.state.howToId][this.props.lang].example}</p>
              <small style={{ color: '#4CAF50' }}>
                {howToPlay[this.state.howToId][this.props.lang].extra}
              </small>
            </div>
          ) : (
            ''
          )}
        </Modal>
      </>
    );
  }
}

export default withTranslation()(MoreView);
