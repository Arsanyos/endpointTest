export default class SlipComp {
  get_all_configurations = () => {
    return {
      MAX_WIN: 350000,
      TAXABLE_WIN: 1000,
      WIN_TAX: 0.15,
      VAT_TAX: 0.15,
      SLIP_SIZE: 20,
      BONUS_PERCENT: 0.05,
    };
  };

  get_configurations = (configuration_name) => {
    return this.get_all_configurations()[configuration_name];
  };

  constructor(placedbet, total_odds) {
    this.placedbet = placedbet || 0;
    this.total_odds = total_odds || 0;
  }

  get_tax_value = () => {
    return this.get_configurations('VAT_TAX');
  };

  get_placed_bet = () => {
    return this.placedbet;
  };
  //Represnets the stake
  get_stake = () => {
    return this.placedbet / (1 + this.get_tax_value());
  };

  // Calculates the vat from the stake
  get_vat_tax = () => {
    let vat_tax = this.get_stake() * this.get_configurations('VAT_TAX');

    return vat_tax;
  };

  // this represnets taxes applied on the betting amount.
  get_initial_tax = () => {
    return this.get_vat_tax();
  };

  // represents the maximum winning value with no bonus and before winning tax
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

  calculate_tax = () => {
    let win_value = this.get_win_value() + this.get_bonus_value();
    let tax_value = 0;

    if (win_value > this.get_configurations('TAXABLE_WIN'))
      tax_value = win_value * this.get_configurations('WIN_TAX');

    return tax_value;
  };

  get_net_pay = () => {
    let win_value = this.get_win_value();
    let bonus_value = this.get_bonus_value();
    let net_pay = win_value + bonus_value;

    let win_tax = this.calculate_tax();
    net_pay = net_pay - win_tax;

    // if (net_pay < this.placedbet) net_pay = this.placedbet;

    return net_pay;
  };

  get_bonus_value = () => {
    /** 
    Bonus is calcuated : The initital tax value multiplied 
    by the total odd value. 
    **/

    let win_value = this.get_win_value();

    if (win_value > 1000) {
      let tax_bonus_value = this.get_initial_tax() * this.total_odds;
      let win_value_bonus =
        win_value * this.get_configurations('BONUS_PERCENT');
      let bonus_on_tax_bonus_value =
        this.get_configurations('BONUS_PERCENT') * tax_bonus_value;

      let bonus_value =
        bonus_on_tax_bonus_value + tax_bonus_value + win_value_bonus;

      if (win_value + bonus_value > this.get_configurations('MAX_WIN'))
        bonus_value = this.get_configurations('MAX_WIN') - win_value;

      if (bonus_value < 0) bonus_value = 0;

      return bonus_value;
    } else {
      return 0;
    }
  };
}
