import PageLoader from '@components/LoaderPages/PageLoader';
import API from '@services/API';
import React, { useEffect, useRef, useState } from 'react';
import ReactHtmlParser from 'html-react-parser';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Empty from '@components/Empty';

export default function PrivacyPoilcy() {
  const [loading, setLoading] = useState(false);
  const [privacypolicy, setPrivacypolicy] = useState([]);
  const termsRef = useRef(null);
  const { t } = useTranslation();

  const configurations = useSelector(
    (state) => state.configuration.configurations
  );

  useEffect(() => {
    setLoading(true);
    API.findWithNoToken('company.note/privacypolicy/', null, null)
      .then((response) => {
        setPrivacypolicy(response.data);
        setLoading(false);
      })
      .catch((err) => {
        // console.log(err);
        setLoading(false);
      });
  }, []);

  // privacypolicy

  useEffect(() => {
    if (termsRef.current !== null) {
      termsRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start',
      });
    }
  }, [termsRef.current]);

  return (
    <div>
      <div
        ref={termsRef}
        className="flex h-9   items-center bg-secondary-600 pr-2"
      >
        <div className="flex w-full items-center justify-center ">
          <span className="flex items-center text-xl uppercase text-white ">
            {t('PrivacyPolicy')}
          </span>
        </div>
      </div>

      {false && !loading && !privacypolicy.note && (
        <div className="flex  flex-col gap-3 px-6 py-4 text-white">
          {/* <h1 className="text-xl capitalize text-white ">Privacy Policy</h1> */}

          <h1 className="text-xl font-semibold text-white">General</h1>

          <p>
            We comply with all applicable data protection and privacy laws. If
            you do not understand how we handle or use the personal information
            you provide to us, then you are invited to send in any questions to
            <a href={configurations.domain_name}>
              {configurations.domain_name}
            </a>
          </p>

          <h1 className="text-lg font-semibold text-white">
            Information Collected
          </h1>

          <p>
            During the registration process; when you use your account; and when
            you request a withdrawal from your account, specific personal data
            {`"("Personal Data")"`} is collected including, but not limited to:
            government-issued ID number, PIN number, phone/mobile number, first
            and last name, date of birth, credit card data, home or another
            physical address, e-mail address, or other contact data. In
            addition, we may collect and log a record of all telephone calls,
            internet communications, details of transactions you carry through
            the site and details of your visits to the site. Any personal data
            received is processed in accordance with your rights, obtained only
            for a specific and lawful purpose, kept in a secure manner, and is
            utilized for marketing purposes based on the opt-out principle.
            Please note that all correspondence and telephone calls may be
            recorded for training purposes.
          </p>

          <h1 className="text-lg font-semibold text-white">
            Disclosure of Information
          </h1>

          <p>
            We will authorise the financial institution which you used when
            registering an account, to provide information about you should this
            be requested by the local Gambling Commission in relation to your
            gaming. We will disclose personal data when ordered to do so by any
            governing authority and/or under any legal provision contained in
            the governing law. We will also disclose information as required to
            enforce our Terms and Conditions. For fraud detection and control
            purposes, you agree that we retain the right to transfer your
            personal data to third parties, including so-called AVS service
            providers and other partners, should the need arise. Furthermore, we
            reserve the right to disclose personal data to relevant recipients
            where we have reasonable grounds to suspect irregularities that
            involve an account.
          </p>

          <h1 className="text-lg font-semibold text-white">
            Customer Relationship Management (CRM) and Marketing Materials
          </h1>

          <p>
            We reserve the right to process personal data for CRM / marketing
            purposes. By registering an account, you automatically opt in to all
            promotional marketing across all platforms. You can opt out at any
            point by contacting us at
            <a href={configurations.domain_name}>
              {configurations.domain_name}
            </a>
            Our website may, from time to time, contain links to and from the
            websites of our partner networks, advertisers and affiliates. Please
            note that these websites may have their own privacy policies and
            that we do not accept any responsibility whatsoever for these
            policies. Please check these policies carefully before you submit
            any personal data, as we cannot be held responsible for the policies
            of partner websites.
          </p>

          <h1 className="text-lg font-semibold text-white">
            Correction of Incorrect Account Information
          </h1>

          <p>
            You have the right to request access to your own personal data
            and/or have the right to correct and/or erase wrong and/or
            inappropriate data, so long as specific gaming regulations do not
            require us to retain certain personal information about you. To
            exercise such rights, you are required to submit a request together
            with proof of identity to
            <a href={configurations.domain_name}>
              {configurations.domain_name}
            </a>
          </p>

          <h1 className="text-lg font-semibold text-white">
            Cookies / ActiveX
          </h1>

          <p>
            You agree that we may, from time to time, use a cookie and Active X
            components on your device to save information (such as user name,
            password, other personal details, e-mail address etc.) so you do not
            have to re-enter this information each time you visit our site. This
            cookie cannot be used to run programs or deliver viruses to your
            computer, and is uniquely assigned to you. It can only be read by a
            web server in the domain that issued the cookie to you. The primary
            purpose of the cookie is to enable you to save time and facilitate
            future access to the site. We do not use cookies that are intrusive
            to your privacy (tracking cookies) for the purpose of capturing
            online promotional behaviour (behavioural marketing). In the event
            that this type of cookie is employed, we will ask for your consent.
          </p>

          <h1 className="text-lg font-semibold text-white">
            Communication and Opt-out
          </h1>

          <p>
            In registering an account to use our service, you consent to us
            contacting you through any and all means of communication (whether
            in written or verbal form and including, but not limited to e-mail,
            telephone and SMS) in respect of matters relating to your account.
            To unsubscribe from any or all forms of communication, please either
            use the ‘Unsubscribe’ link found in our promotional e-mails or
            contact us at{' '}
            <a href={configurations.domain_name}>
              {configurations.domain_name}
            </a>
          </p>
        </div>
      )}
      <div className="flex  flex-col gap-3 px-6 py-4 text-white">
        {!loading && privacypolicy.note && (
          <>{ReactHtmlParser(privacypolicy.note)}</>
        )}
        {!loading && !privacypolicy.note && (
          <Empty message={'Privacy policy not available now.'} />
        )}
      </div>
      {loading && <PageLoader />}
    </div>
  );
}
