export default class MultiBonus {
  constructor(placedbet, total_odds, match_count) {
    this.placedbet = placedbet || 0;
    this.total_odds = total_odds || 0;
    this.match_count = match_count || 0;
  }

  static ConfigurationDescription = () => ({
    TAX_TYPE: 'none',
  });

  get_all_configurations = (configuration_name) => {
    let all_configurations = {
      TAXABLE_WIN: 1000,
      WIN_TAX: 0.15,
      TOT_TAX: 0.1,
      VAT_TAX: 0.15,
      VAT_TAX_LABEL: 'VAT',
      TAX_TYPE: 'vat',
      WITHHOLDING_TAX: 0.14,
      NUM_ELIGIBLE_MATCHES: 0,
    };

    all_configurations['BET_SLIP_BONUS'] = true;
    all_configurations['MAX_WIN'] = 350000;
    all_configurations['SLIP_SIZE'] = 20;
    all_configurations['MAX_BONUS'] = 52400;
    all_configurations['MIN_BONUS_ODD'] = 1.4;

    return all_configurations[configuration_name];
  };

  get_configurations = (configuration_name) => {
    return this.get_all_configurations(configuration_name);
  };

  get_tax_value = () => {
    if (this.get_configurations('TAX_TYPE') == 'tot')
      return this.get_configurations('TOT_TAX');
    else if (this.get_configurations('TAX_TYPE') == 'vat')
      return this.get_configurations('VAT_TAX');
  };

  get_placed_bet = () => {
    return this.placedbet;
  };
  //Represnets the stake
  get_stake = () => {
    if (this.get_configurations('TAX_TYPE') == 'tot')
      return this.placedbet * (1 - this.get_tax_value());
    else if (this.get_configurations('TAX_TYPE') == 'vat')
      return this.placedbet / (1 + this.get_tax_value());

    return 0;
  };

  // Cacluates the tot from the stake
  get_tot_tax = () => {
    let tot_tax = this.placedbet * this.get_configurations('TOT_TAX');

    return tot_tax;
  };

  // Calculates the vat from the stake
  get_vat_tax = () => {
    let vat_tax = this.get_stake() * this.get_configurations('VAT_TAX');

    return vat_tax;
  };

  // this represnets taxes applied on the betting amount.
  //Vat or Tot are two taxes considered in this stage of the calculation
  get_initial_tax = () => {
    if (this.get_configurations('TAX_TYPE') == 'tot') return this.get_tot_tax();
    else if (this.get_configurations('TAX_TYPE') == 'vat')
      return this.get_vat_tax();
  };

  get_match_count = () => {
    return this.match_count;
  };

  get_max_bonus_eligble_match_count = () => {
    return 20;
  };

  get_min_bonus_eligble_match_count = () => {
    return 3;
  };
  get_bonus_eligble_match_count = () => {
    return (
      Number(this.total_odds / this.get_minimum_total_eligible_odd()).toFixed(
        0
      ) +
      this.get_min_bonus_eligble_match_count -
      1
    );
  };

  get_percentages = (match_count) => {
    return {
      3: 0.03,
      4: 0.04,
      5: 0.05,
      6: 0.06,
      7: 0.1,
      8: 0.15,
      9: 0.2,
      10: 0.25,
      11: 0.3,
      12: 0.35,
      13: 0.4,
      14: 0.45,
      15: 0.5,
      16: 0.55,
      17: 0.6,
      18: 0.65,
      19: 0.7,
      20: 0.75,
    }[match_count];
  };

  get_percentages_we_bets = (match_count) => {
    if (match_count >= 38) return 3; // 300%
    return {
      6: 0.02,
      7: 0.03,
      8: 0.04,
      9: 0.07,
      10: 0.07,
      11: 0.1,
      12: 0.1,
      13: 0.14,
      14: 0.14,
      15: 0.22,
      16: 0.22,
      17: 0.29,
      18: 0.29,
      19: 0.42,
      20: 0.42,
      21: 0.72,
      22: 0.72,
      23: 0.72,
      24: 1.5,
      25: 1.5,
      26: 1.5,
      27: 1.5,
      28: 2,
      29: 2,
      30: 2,
      31: 2,
      32: 2.5,
      33: 2.5,
      34: 2.5,
      35: 2.5,
      36: 2.5,
      37: 2.5,
    }[match_count];
  };

  is_odd_bonus_eligible = () => {
    return this.total_odds >= this.get_minimum_total_eligible_odd();
  };

  get_minimum_total_eligible_odd = () => {
    return (
      this.get_configurations('MIN_BONUS_ODD') **
      this.get_min_bonus_eligble_match_count()
    );
  };

  calculate_bonus_value = () => {
    if (!this.is_odd_bonus_eligible()) return 0;
    let percentage = this.get_percentages_we_bets(
      this.get_percentage_match_count()
    );
    let max_percentage = this.get_percentages_we_bets(
      this.get_max_bonus_eligble_match_count()
    );
    if (!percentage) return 0;
    let win_value = this.get_win_value();
    let max_possible_bonus = win_value * max_percentage;
    let bonus_value = win_value * percentage;

    if (bonus_value > max_possible_bonus) bonus_value = max_possible_bonus;

    if (bonus_value > this.get_configurations('MAX_BONUS'))
      bonus_value = this.get_configurations('MAX_BONUS');

    return bonus_value;
  };

  get_bonus_value = () => {
    return this.calculate_bonus_value();
  };

  get_percentage_match_count = () => {
    if (this.match_count < this.get_min_bonus_eligble_match_count())
      return this.match_count;

    let percentage_match_count = this.get_total_odd_match_count();

    if (percentage_match_count > this.get_max_bonus_eligble_match_count())
      percentage_match_count = this.get_max_bonus_eligble_match_count();

    return percentage_match_count;
  };

  get_total_odd_match_count2 = () => {
    let percentage_match_count = 0;
    if (2.744 <= this.total_odds && this.total_odds < 3.8416)
      percentage_match_count = 3;
    else if (3.8416 <= this.total_odds && this.total_odds < 5.37824)
      percentage_match_count = 4;
    else if (5.37824 <= this.total_odds && this.total_odds < 7.529536)
      percentage_match_count = 5;
    else if (7.529536 <= this.total_odds && this.total_odds < 10.5413504)
      percentage_match_count = 6;
    else if (10.5413504 <= this.total_odds && this.total_odds < 14.75789056)
      percentage_match_count = 7;
    else if (14.75789056 <= this.total_odds && this.total_odds < 20.661046784)
      percentage_match_count = 8;
    else if (20.661046784 <= this.total_odds && this.total_odds < 28.9254654976)
      percentage_match_count = 9;
    else if (
      28.9254654976 <= this.total_odds &&
      this.total_odds < 40.4956516966
    )
      percentage_match_count = 10;
    else if (
      40.4956516966 <= this.total_odds &&
      this.total_odds < 56.6939123753
    )
      percentage_match_count = 11;
    else if (
      56.6939123753 <= this.total_odds &&
      this.total_odds < 79.3714773254
    )
      percentage_match_count = 12;
    else if (
      79.3714773254 <= this.total_odds &&
      this.total_odds < 111.1200682556
    )
      percentage_match_count = 13;
    else if (
      111.1200682556 <= this.total_odds &&
      this.total_odds < 155.5680955578
    )
      percentage_match_count = 14;
    else if (
      155.5680955578 <= this.total_odds &&
      this.total_odds < 217.7953337809
    )
      percentage_match_count = 15;
    else if (
      217.7953337809 <= this.total_odds &&
      this.total_odds < 304.9134672933
    )
      percentage_match_count = 16;
    else if (
      304.9134672933 <= this.total_odds &&
      this.total_odds < 426.8788542106
    )
      percentage_match_count = 17;
    else if (
      426.8788542106 <= this.total_odds &&
      this.total_odds < 597.6303958949
    )
      percentage_match_count = 18;
    else if (
      597.6303958949 <= this.total_odds &&
      this.total_odds < 836.6825542528
    )
      percentage_match_count = 19;
    else if (this.total_odds >= 836.6825542528) percentage_match_count = 20;

    return percentage_match_count;
  };

  // this returns the text to show to the customers.
  get_note = () => {
    let percentage = this.get_percentages_we_bets(
      this.get_percentage_match_count()
    );
    let note = null;
    if (percentage) {
      note = `Current Bonus ${(percentage * 100).toFixed(2)}%`;
    } else if (
      this.get_match_count() < this.get_min_bonus_eligble_match_count()
    ) {
      note = `Select ${
        this.get_min_bonus_eligble_match_count() - this.get_match_count()
      } more matches and get a 3% win bonus`;
    } else if (
      !percentage &&
      this.get_match_count() >= this.get_min_bonus_eligble_match_count()
    ) {
      let min_odd = this.get_minimum_total_eligible_odd();
      note = `Select more matches to get minimum total odd of ${min_odd.toFixed(
        2
      )} & get a 3% win bonus`;
    }

    return note;
  };

  get_total_odd_match_count = () => {
    let total_odd = this.get_configurations('MIN_BONUS_ODD');
    let match_count = 0;
    let acceptable_total_odd =
      this.get_configurations('MIN_BONUS_ODD') ** this.match_count;

    while (true) {
      if (this.total_odds > total_odd) {
        match_count += 1;
        total_odd *= this.get_configurations('MIN_BONUS_ODD');
      } else if (total_odd > acceptable_total_odd) {
        match_count = this.match_count;
        break;
      } else if (match_count >= this.get_configurations('SLIP_SIZE')) break;
      else {
        break;
      }
    }

    return match_count;
  };

  get_win_value = () => {
    let netstake = this.get_stake();
    let tentedstake = this.get_configurations('MAX_WIN') / this.total_odds;

    let win_value = netstake * this.total_odds;

    if (win_value > this.get_configurations('MAX_WIN')) {
      let extrastake = netstake - tentedstake;
      win_value = this.get_configurations('MAX_WIN') + extrastake;
    }

    return win_value;
  };

  calculate_win_tax = () => {
    let win_value = this.get_win_value() + this.get_bonus_value();
    let tax_value = 0;

    if (win_value >= 1000) tax_value = 0.15 * win_value;

    return tax_value;
  };

  get_net_pay = () => {
    let win_value = this.get_win_value();
    let bonus_value = this.get_bonus_value();
    let net_pay = win_value + bonus_value;

    let win_tax = this.calculate_win_tax();
    net_pay = net_pay - win_tax;

    return net_pay;
  };
}
