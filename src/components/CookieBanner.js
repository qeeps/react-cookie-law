import React from 'react';
import PropTypes from 'prop-types';
import Cookies from '../Cookies';
import CookieBannerContent from './CookieBannerContent';
import { isServer } from '../helpers';

const CONSENT_GIVEN = 'rcl_consent_given';
const PREFERENCES_COOKIE = 'rcl_preferences_consent';
const STATISTICS_COOKIE = 'rcl_statistics_consent';
const MARKETING_COOKIE = 'rcl_marketing_consent';

class CookieBanner extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      preferencesCookies: this.props.preferencesOptionInitiallyChecked || false,
      statisticsCookies: this.props.statisticsOptionInitiallyChecked || false,
      marketingCookies: this.props.marketingOptionInitiallyChecked || false,
    };

    this.onScroll = this.onScroll.bind(this);
    this.onTogglePreferencesCookies = this.onTogglePreferencesCookies.bind(this);
    this.onToggleStatisticsCookies = this.onToggleStatisticsCookies.bind(this);
    this.onToggleMarketingCookies = this.onToggleMarketingCookies.bind(this);
    this.confirmAll = this.confirmAll.bind(this);
    this.confirmSelection = this.confirmSelection.bind(this);
    this.consetsCallback = this.consetsCallback.bind(this);

    this.cookies = new Cookies();
  }

  componentDidMount() {
    const { dismissOnScroll } = this.props;

    if (isServer() || dismissOnScroll !== true) {
      return;
    }

    if (window.addEventListener) {
      window.addEventListener('scroll', this.onScroll);
    } else if (window.attachEvent) {
      window.attachEvent('onscroll', this.onScroll); // < IE9
    }
  }

  componentWillUnmount() {
    if (isServer()) {
      return;
    }

    if (window.removeEventListener) {
      window.removeEventListener('scroll', this.onScroll);
    } else if (window.detachEvent) {
      window.detachEvent('onscroll', this.onScroll); // < IE9
    }
  }

  onScroll() {
    this.confirmAll();
  }

  onTogglePreferencesCookies() {
    const { preferencesCookies } = this.state;
    this.setState({ preferencesCookies: !preferencesCookies });
  }

  onToggleStatisticsCookies() {
    const { statisticsCookies } = this.state;
    this.setState({ statisticsCookies: !statisticsCookies });
  }

  onToggleMarketingCookies() {
    const { marketingCookies } = this.state;
    this.setState({ marketingCookies: !marketingCookies });
  }

  confirmAll() {
    this.cookies.set(CONSENT_GIVEN);
    this.cookies.set(PREFERENCES_COOKIE);
    this.cookies.set(STATISTICS_COOKIE);
    this.cookies.set(MARKETING_COOKIE);

    this.forceUpdate();
  }

  confirmSelection() {
    const { preferencesCookies, statisticsCookies, marketingCookies } = this.state;

    this.cookies.set(CONSENT_GIVEN);

    if (preferencesCookies) {
      this.cookies.set(PREFERENCES_COOKIE);
    } else {
      this.cookies.remove(PREFERENCES_COOKIE);
    }

    if (statisticsCookies) {
      this.cookies.set(STATISTICS_COOKIE);
    } else {
      this.cookies.remove(STATISTICS_COOKIE);
    }

    if (marketingCookies) {
      this.cookies.set(MARKETING_COOKIE);
    } else {
      this.cookies.remove(MARKETING_COOKIE);
    }

    this.forceUpdate();
  }

  consetsCallback() {
    const {
      onAccept = Function,
      onAcceptPreferences = Function,
      onAcceptStatistics = Function,
      onAcceptMarketing = Function,
      onDeclinePreferences = Function,
      onDeclineStatistics = Function,
      onDeclineMarketing = Function,
    } = this.props;

    const hasPreferencesCookie = this.cookies.get(PREFERENCES_COOKIE);
    const hasStatisticsCookie = this.cookies.get(STATISTICS_COOKIE);
    const hasMarketingCookie = this.cookies.get(MARKETING_COOKIE);

    onAccept();

    if (hasPreferencesCookie) {
      onAcceptPreferences();
    } else {
      onDeclinePreferences();
    }

    if (hasStatisticsCookie) {
      onAcceptStatistics();
    } else {
      onDeclineStatistics();
    }

    if (hasMarketingCookie) {
      onAcceptMarketing();
    } else {
      onDeclineMarketing();
    }
  }

  render() {
    const {
      styles,
      className,
      message,
      policyLink,
      privacyPolicyLinkText,
      necessaryOptionText,
      preferencesOptionText,
      statisticsOptionText,
      marketingOptionText,
      showAcceptSelectionButton,
      acceptAllButtonText,
      acceptSelectionButtonText,
      showPreferencesOption,
      showStatisticsOption,
      showMarketingOption,
    } = this.props;

    if (this.cookies.get(CONSENT_GIVEN)) {
      this.consetsCallback();
      return null;
    }

    const contentProps = {
      styles,
      className,
      message,
      policyLink,
      privacyPolicyLinkText,
      necessaryOptionText,
      preferencesOptionText,
      statisticsOptionText,
      marketingOptionText,
      showAcceptSelectionButton,
      acceptAllButtonText,
      acceptSelectionButtonText,
      showPreferencesOption,
      showStatisticsOption,
      showMarketingOption,
      preferencesOptionInitiallyChecked: this.props.preferencesOptionInitiallyChecked,
      statisticsOptionInitiallyChecked: this.props.statisticsOptionInitiallyChecked,
      marketingOptionInitiallyChecked: this.props.marketingOptionInitiallyChecked,
      onTogglePreferencesCookies: this.onTogglePreferencesCookies,
      onToggleStatisticsCookies: this.onToggleStatisticsCookies,
      onToggleMarketingCookies: this.onToggleMarketingCookies,
      onConfirmSelection: this.confirmSelection,
      onConfirmAll: this.confirmAll,
    };

    return (<CookieBannerContent {...contentProps} />);
  }
}

CookieBanner.protoTypes = {
  className: PropTypes.string,
  styles: PropTypes.object,
  message: PropTypes.string.isRequired,
  policyLink: PropTypes.string,
  privacyPolicyLinkText: PropTypes.string,
  necessaryOptionText: PropTypes.string,
  preferencesOptionText: PropTypes.string,
  statisticsOptionText: PropTypes.string,
  marketingOptionText: PropTypes.string,
  acceptAllButtonText: PropTypes.string,
  acceptSelectionButtonText: PropTypes.string,
  showAcceptSelectionButton: PropTypes.bool,
  dismissOnScroll: PropTypes.bool,
  showPreferencesOption: PropTypes.bool,
  showStatisticsOption: PropTypes.bool,
  showMarketingOption: PropTypes.bool,
  preferencesOptionInitiallyChecked: PropTypes.bool,
  statisticsOptionInitiallyChecked: PropTypes.bool,
  marketingOptionInitiallyChecked: PropTypes.bool,
  onAccept: PropTypes.func,
  onAcceptPreferences: PropTypes.func,
  onAcceptStatistics: PropTypes.func,
  onAcceptMarketing: PropTypes.func,
  onDeclinePreferences: PropTypes.func,
  onDeclineStatistics: PropTypes.func,
  onDeclineMarketing: PropTypes.func,
};

export default CookieBanner;
