import { PlaySquareOutlined } from '@ant-design/icons';
import Collapse from '@components/Collapse';
import { EmblaCarousel } from '@components/EmblaCarousel';
import Modal from '@components/Modal';
import API from '@services/API';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlinePlayCircle } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import ReactHtmlParser from 'html-react-parser';
import Empty from '@components/Empty';

const YoutubeEmbed = ({ videoID, autoplay }) => {
  return (
    <iframe
      // height="100%"
      className="aspect-video w-full "
      src={`https://www.youtube.com/embed/${videoID}${
        autoplay && '?autoplay=1'
      }`}
      frameBorder="0"
      allow={`accelerometer; ${
        autoplay ? 'autoplay;' : ''
      } clipboard-write; encrypted-media; gyroscope; picture-in-picture`}
      allowFullScreen
      title="Embedded youtube"
    />
  );
};
export default function FAQ() {
  const [expand, setExpand] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [URI, setURI] = useState(null);
  const [loading, setLoading] = useState(false);
  const [faqs, setFaqs] = useState(null);

  const configurations = useSelector(
    (state) => state.configuration.configurations
  );

  const faqRef = useRef(null);
  const { i18n } = useTranslation();

  useEffect(() => {
    setLoading(true);
    API.findWithNoToken('company.note/faq/', null, null)
      .then((response) => {
        console.log(response);
        setFaqs(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (faqRef.current !== null) {
      faqRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'start',
      });
    }
  }, [faqRef.current]);

  const changeCollapseFAQ = (id) => {
    if (selectedItem == id && expand == true) {
      setExpand((expand) => !expand);
    } else if (selectedItem == id && expand == false) {
      setSelectedItem(id);
      setExpand((expand) => !expand);
    } else if (selectedItem != id && expand == false) {
      setSelectedItem(id);
      setExpand((expand) => !expand);
    } else {
      setSelectedItem(id);
    }
  };

  const faqItems = [
    {
      id: 1,
      title:
        i18n.resolvedLanguage == 'Am'
          ? `${configurations.name} ማነው`
          : `Who is ${configurations.name}`,
      body: (
        <div>
          {i18n.resolvedLanguage == 'Am' ? (
            <p>
              ሁሰፖርት በኢትዮጵያ ውስጥ መሪ ከሚባለት ምርጥ የስፖርት ውርርዶች አንዱ ነው፡፡{' '}
              {configurations.name} ህጋዊ፣ መደበኛ እና ተገቢውን አገልግሎት የሚሰጥ የስፖርት ውርርድ
              ኩባንያ ነው፡፡ እንዲሁም በኢትዮጵያ ብቸኛ ሀገር በቀል ቤት አደግ ኩባንያ ነው፡፡
            </p>
          ) : (
            <p>
              {configurations.name} is one of the best leading brands in sports
              betting in Ethiopia. {configurations.name} betting is a standard
              licensed and well-functioning sports betting company. it is also
              the only indigenous Ethiopian and “home-grown” company.
            </p>
          )}
        </div>
      ),
    },
    {
      id: 2,
      title:
        i18n.resolvedLanguage == 'Am'
          ? `${configurations.name} ምን ምን የውርርድ ምርቶች ያቀርባል`
          : `What betting products does ${configurations.name} offer`,
      body: (
        <div>
          {i18n.resolvedLanguage == 'Am' ? (
            <p>
              {configurations.name} በዋናነት በድህረገጻችን{' '}
              <a href={configurations.domain_name} className="text-sky-300">
                {configurations.domain_name}
              </a>
              ላይ የተገለጹትን ኦንላይን የስፖርት ውርርድ አገልግሎቶችን ያቀርባል፡፡ በኦንላይን መዝናኛ ላይ ምርጡን
              ምርጡን ለእርስዎ ለማቅረብ ያለማቅዋረጥ የእኛን የምርት አቅርቦት ለማሻሻል እንጥራለን፡፡
            </p>
          ) : (
            <p>
              {configurations.name} primarily offers online sports betting
              services that are shown on our website{' '}
              <a href={configurations.domain_name} className="text-sky-300">
                {configurations.domain_name}
              </a>
              . We constantly strive to improve our product offering to bring
              you the best in online entertainment.
            </p>
          )}
        </div>
      ),
    },
    {
      id: 3,
      title:
        i18n.resolvedLanguage == 'Am'
          ? 'እኛን ለማግኘት?'
          : 'What are your contact details',
      body: (
        <div>
          {i18n.resolvedLanguage == 'Am' ? (
            <p>በስልክ ቁጥራችን +251 11 672 160፣ +2511672164 ያነኙናል፡፡</p>
          ) : (
            <p>You can contact us via Tel +251-11672160, +251-11672164</p>
          )}
        </div>
      ),
    },
    {
      id: 4,
      title:
        i18n.resolvedLanguage == 'Am' ? (
          <h3 className="m-0 text-lg font-semibold text-white ">መለያ</h3>
        ) : (
          <h3 className="m-0 text-lg font-semibold text-white ">Account</h3>
        ),
      body: '',
    },
    {
      id: 5,
      title:
        i18n.resolvedLanguage == 'Am'
          ? 'እንዴት መመዝገብ እችላለሁ'
          : 'How do I register an account',
      body: (
        <div className="flex flex-col">
          {i18n.resolvedLanguage == 'Am' ? (
            <p>
              በ{configurations.name} መለያ መመዝገብ ቀላል እና ፈጣን ነው፡፡ እነዚህን ቅደምተከተሎች
              ይከተሉ:-
            </p>
          ) : (
            <p>
              Registering an account with {configurations.name} is quick and
              easy. follow this steps:-
            </p>
          )}
          <ul className="list-disc pl-2">
            <li>
              {i18n.resolvedLanguage == 'Am'
                ? 'በስተቀኝ ጥግ ወደሚገኘው “ይመዝገቡ” ትር ይሂዱ'
                : 'Go to the register tab at the top  right corner'}
            </li>
            <li>
              {i18n.resolvedLanguage == 'Am'
                ? 'የሚጠየቀውን መረጃ በመሙላት “ይመዝገቡ” ቁልፉን ይጫኑ'
                : 'Fill the information that required and click register button'}
            </li>
            <li>
              {i18n.resolvedLanguage == 'Am'
                ? 'በኤስኤምኤስ ወደ ስልክዎት የተላከውን የኦቲፒ ቁጥር ያስገቡና “አረጋግጥ” የሚለውን ቁልፍ ይንኩ'
                : 'Enter the OTP number that sent to your phone number via SMS and click verify'}
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 6,
      title:
        i18n.resolvedLanguage == 'Am'
          ? 'መለያ ለመመዝብ መክፈል አለብኝ '
          : 'Do I have to pay to register an account',
      body: (
        <div className="flex flex-col">
          {i18n.resolvedLanguage == 'Am' ? (
            <p>
              በ{configurations.name} ስፖርት መለያ መመውዝገብ ከክፍያ ነፃ ነው። ይሁንእንጂ ለኦንላይን
              ውስርድ በመጀመሪያ ወደ {configurations.name}
              መለያ ገንዘብ ማስገባት ይኖርብዎታል። ውርርድ ለማድረግ በመለያዎ ውስጥ በቂ ገንዘብ ሊኖርዎት ይገባል።
            </p>
          ) : (
            <p>
              Registering an account with {configurations.name} is free of
              charge. You will, however, need to deposit funds into your{' '}
              {configurations.name} account first to place a bet online. You
              must have sufficient funds in your account to place bets.
            </p>
          )}
        </div>
      ),
    },
    {
      id: 7,
      title:
        i18n.resolvedLanguage == 'Am'
          ? 'መለያ ለማውጣት ምን ምን መረጃዎች ማስገባት(መስጠት) አለብኝ?'
          : 'What information do I need to provide to register an account?',
      body: (
        <div className="flex flex-col">
          {i18n.resolvedLanguage == 'Am' ? (
            <p>
              መለያ ለማውጣት ሙሉ ስም፣ ስልክ ቁጥር እና የይለፍ ቃል እንዲያስገቡ ይጠየቃሉ (ማለትም የሪፈራል ኮድ
              እንዲሞሉ አይጠየቁም ነገርግን የተመዘገቡት በግብዣ አገናኝ ከሆነ ሪፈራል ኮዱ በራሱ የተሞላ ይሆናል)
            </p>
          ) : (
            <p>
              To register an account, you will be required to provide us with
              your full name, phone number, and password (i.e., it does not
              require you to fill in the referral code but if you register via
              the invitation link the referral code is automatically filled).
            </p>
          )}
        </div>
      ),
    },
    {
      id: 8,
      title:
        i18n.resolvedLanguage == 'Am'
          ? 'ወደ መለያዬ እንዴት መግባት እችላለሁ?'
          : 'How to log in to my account?',
      body: (
        <div className="flex flex-col">
          {i18n.resolvedLanguage == 'Am' ? (
            <p>
              ለመግባት የ{configurations.name} መለያ ሊኖሮት ይገባል የ{configurations.name}{' '}
              ስፖርት መለያ ካለዎት እንዚህን ቅደምተከተሎች ይከተሉ:-
            </p>
          ) : (
            <p>
              To log in, you must have a {configurations.name} account. If you
              have a {configurations.name}
              account, follow these steps:-
            </p>
          )}
          <ul className="list-disc pl-2">
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'በስተቀኝ ጥግ ወደሚገኘው “ይመዝገቡ” ትር ይሂዱ'
                  : 'Go to the login tab at the top right corner'}
              </span>
              {/* TODO: Add img */}
            </li>
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'የሚጠየቀውን መረጃ በመሙላት “ይመዝገቡ” ቁልፉን ይጫኑ'
                  : 'Fill the information that required and click register button'}
              </span>
              {/* TODO: Add img */}
            </li>
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'በኤስኤምኤስ ወደ ስልክዎት የተላከውን የኦቲፒ ቁጥር ያስገቡና “አረጋግጥ” የሚለውን ቁልፍ ይንኩ'
                  : 'Enter the OTP number that sent to your phone number via SMS and click verify'}
              </span>
              {/* TODO: Add img */}
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 9,
      title:
        i18n.resolvedLanguage == 'Am'
          ? 'መለያ ለመመዝብ መክፈል አለብኝ?'
          : 'Do I have to pay to register an account?',
      body: (
        <div className="flex flex-col">
          {i18n.resolvedLanguage == 'Am' ? (
            <p>
              በ{configurations.name} ስፖርት መለያ መመውዝገብ ከክፍያ ነፃ ነው። ይሁንእንጂ ለኦንላይን
              ውስርድ በመጀመሪያ ወደ {configurations.name}
              መለያ ገንዘብ ማስገባት ይኖርብዎታል። ውርርድ ለማድረግ በመለያዎ ውስጥ በቂ ገንዘብ ሊኖርዎት ይገባል።
            </p>
          ) : (
            <p>
              Registering an account with {configurations.name} is free of
              charge. You will, however, need to deposit funds into your{' '}
              {configurations.name} account first to place a bet online. You
              must have sufficient funds in your account to place bets.
            </p>
          )}
        </div>
      ),
    },
    {
      id: 10,
      title:
        i18n.resolvedLanguage == 'Am'
          ? 'መለያ ለማውጣት ምን ምን መረጃዎች ማስገባት(መስጠት) አለብኝ?'
          : 'What information do I need to provide to register an account?',
      body: (
        <div className="flex flex-col">
          {i18n.resolvedLanguage == 'Am' ? (
            <p>
              መለያ ለማውጣት ሙሉ ስም፣ ስልክ ቁጥር እና የይለፍ ቃል እንዲያስገቡ ይጠየቃሉ (ማለትም የሪፈራል ኮድ
              እንዲሞሉ አይጠየቁም ነገርግን የተመዘገቡት በግብዣ አገናኝ ከሆነ ሪፈራል ኮዱ በራሱ የተሞላ ይሆናል)
            </p>
          ) : (
            <p>
              To register an account, you will be required to provide us with
              your full name, phone number, and password (i.e., it does not
              require you to fill in the referral code but if you register via
              the invitation link the referral code is automatically filled).
            </p>
          )}
        </div>
      ),
    },
    {
      id: 11,
      title:
        i18n.resolvedLanguage == 'Am'
          ? 'ወደ መለያዬ እንዴት መግባት እችላለሁ?'
          : 'How to log in to my account?',
      body: (
        <div className="flex flex-col">
          {i18n.resolvedLanguage == 'Am' ? (
            <p>
              ለመግባት የ{configurations.name} መለያ ሊኖሮት ይገባል የ{configurations.name}{' '}
              ስፖርት መለያ ካለዎት እንዚህን ቅደምተከተሎች ይከተሉ
            </p>
          ) : (
            <p>
              To log in, you must have a {configurations.name} account. If you
              have a {configurations.name}
              account, follow these steps:-
            </p>
          )}
          <ul className="list-disc pl-2">
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'በስተቀኝ ጥግ ወደሚገኘው "ይግቡ" ትር ይሂዱ '
                  : 'Go to the login tab at the top right corner'}
              </span>
              {/* TODO: Add img */}
            </li>
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'ስልክ ቁጥርዎትን እና የይለፍ ቃልዎትን በማስገባት የ"ይግቡ" ቁልፍን ይጫኑ'
                  : 'enter your phone number and password and click the login button'}
              </span>
              {/* TODO: Add img */}
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 12,
      title:
        i18n.resolvedLanguage == 'Am'
          ? '  በመለያያ የሰፈረውን(የተመዘገበውን) የግል መረጃ እንዴት መቀየር/ማሻሻል እችላለሁ?'
          : 'How do I change/update the personal information recorded on my account?',
      body: (
        <div className="flex flex-col">
          {i18n.resolvedLanguage == 'Am' ? (
            <p>
              በ{configurations.name} መለያያ ላይ ያለውን የግል መረጃዎትን ለመቀየርም ሆነ ለማሻሻል ወደ{' '}
              {configurations.name} መለያዎ መግባት አለብዎት፤ ከገቡ በኋላ እንዚህን ቅደምተከተሎች ይከተሉ
            </p>
          ) : (
            <p>
              To change/update your personal information registered on your
              {configurations.name} account, you have to log in to your{' '}
              {configurations.name} account, and after you log in, follow these
              steps:-
            </p>
          )}
          <ul className="list-disc pl-2">
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'በታችኛው ቀኝ ጥግ ወደሚገኘው "ተጨማሪ" ትር ይሂዱ '
                  : 'go to the More tab menu from the bottom right corner'}
              </span>
              {/* TODO: Add img */}
            </li>
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'የእርስዎ መረጃ" የሚለውን ይምረጡ'
                  : 'select my profile for the list'}
              </span>
              {/* TODO: Add img */}
            </li>
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'የግል መረጃዎትን አሻሽለው ሲጨርሱ "አዘምን" የሚለውን ቁልፍ ይጫኑ'
                  : 'update your personal information and click the update button'}
              </span>
              {/* TODO: Add img */}
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 13,
      title:
        i18n.resolvedLanguage == 'Am'
          ? 'ወደመለያዬ መግባት አልቻልኩም'
          : 'I can’t log in to my account?',
      body: (
        <div className="flex flex-col">
          {i18n.resolvedLanguage == 'Am' ? (
            <p>
              ያስገቡት ስልክ ቁጥር እና የይለፍ ቃል ትክክል መሆኑን ያረጋግጡ። አሁንም ወደግል መለያዎ ለመግባት
              ከተቸገሩ እባክዎን የይለፍ ቃል ረስተዋል "የይለፍ ቃልዎን ረስተዋል" ወደሚለው ይሂዱ
            </p>
          ) : (
            <p>
              Please be aware that your phone number and password are correct.
              If you are still having trouble logging in to your account then
              please refer to Forget password.
            </p>
          )}
        </div>
      ),
    },
    {
      id: 14,
      title:
        i18n.resolvedLanguage == 'Am'
          ? 'የይለፍ ቃሌን ለመቀየር'
          : 'Want to change my password?',
      body: (
        <div className="flex flex-col">
          {i18n.resolvedLanguage == 'Am' ? (
            <p>ወደ መለያዎ ከገቡ በኋላ</p>
          ) : (
            <p>After logging in:-</p>
          )}
          <ul className="list-disc pl-2">
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'በታችኛው ቀኝ ጥግ ወደሚገኘው "ተጨማሪ" ትር ይሂዱ'
                  : 'go to the More tab menu from the bottom right corner'}
              </span>
              {/* TODO: Add img */}
            </li>
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'የእርስዎ መረጃ" የሚለውን ይምረጡ'
                  : 'select my profile for the list'}
              </span>
              {/* TODO: Add img */}
            </li>
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'የይለፍ ቃል ይለውጡ" የሚለውን ይምረጡ'
                  : 'select change password?'}
              </span>
              {/* TODO: Add img */}
            </li>
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'መመሪያዎቹን ይከተሉ በመቀጠል "መዝግብ " የሚለውን ቁልፍ ይጫኑ'
                  : 'follow the instructions and click the save button'}
              </span>
              {/* TODO: Add img */}
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 15,
      title:
        i18n.resolvedLanguage == 'Am' ? (
          <h3 className="m-0 text-lg font-semibold text-white ">ተቀማጭ እና ወጪ</h3>
        ) : (
          <h3 className="m-0 text-lg font-semibold text-white ">
            Deposit and withdrawal
          </h3>
        ),
      body: '',
    },
    {
      id: 16,
      title:
        i18n.resolvedLanguage == 'Am'
          ? 'እንዴት ማስገባት እችላለሁ?'
          : 'How do I deposit?',
      body: (
        <div className="flex flex-col">
          {i18n.resolvedLanguage == 'Am' ? (
            <p>
              ወጪ ለማድረግ በቅድሚያ የ{configurations.name} መለያ ሊኖርዎት ይገባል። እነዚህን
              ቅደምተከተሎች ይከተሉ
            </p>
          ) : (
            <p>
              To make a deposit You must have a {configurations.name} account
              and follow these steps:-
            </p>
          )}
          <ul className="list-disc pl-2">
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? `ወደ ${configurations.name} መለያዎ ይግቡ`
                  : `log in to your ${configurations.name} account`}
              </span>
              {/* TODO: Add img */}
            </li>
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'ከላይኛው ቀኝ ጥግ  “ገንዘብ አስገባ” ትር ይሂዱ'
                  : 'select the deposit tab from the top right corner'}
              </span>
              {/* TODO: Add img */}
            </li>
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? '"ገንዘብ አስገባ” የሚለውን ይምረጡና ወጪ ለማድረግ መመሪያዎቹን ይከተሉ '
                  : 'select deposit and follow the instructions to deposit.'}
              </span>
              {/* TODO: Add img */}
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 17,
      title:
        i18n.resolvedLanguage == 'Am'
          ? 'የትኛውን የክፍያ መንገድ ይጠቀማሉ?'
          : 'which payment methods do you accept?',
      body: (
        <div className="flex flex-col">
          {i18n.resolvedLanguage == 'Am' ? (
            <p>
              ድህረ ገፃችን ቴሌብር፣ አዋሽ ብር፣ ሲቢኢ ብር፣ ወጋገን እና አሞሌን የሚዘውን ቻፖ የክፍያ መንገድን
              ይጠቀማል።
            </p>
          ) : (
            <p>
              Our website uses Chapa payment get-way that supports telebirr,
              Awash birr, CBE birr, wegagen, and Amole.
            </p>
          )}
        </div>
      ),
    },
    {
      id: 18,
      title:
        i18n.resolvedLanguage == 'Am'
          ? 'በቻፓ ብር እንዴት ማስገባት ይቻላል?'
          : 'How to deposit chapa?',
      body: (
        <div className="flex flex-col">
          {i18n.resolvedLanguage == 'Am' ? (
            <p>ወደ {configurations.name} መለያዎ ከገቡ በኋላ</p>
          ) : (
            <p>After you log in to your {configurations.name} account:-</p>
          )}
          <ul className="list-disc pl-2">
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'ከላይኛው ቀኝ ጥግ  “ገንዘብ አስገባ” ትር ይሂዱ'
                  : 'select the deposit tab from the top right corner'}
              </span>
              {/* TODO: Add img */}
            </li>
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? '"ገንዘብ አስገባ" ትር ስር "ቻፓ" ትርን ይምረጡ'
                  : 'under the deposit tab select the chapa tab'}
              </span>
              {/* TODO: Add img */}
            </li>
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'የገንዘብ መጠን ያስገቡ ከዚያ "ገንዘብ አስገባ " የሚለውን ቁልፍ ይጫኑ በመቀጠል ሲስተሙ በራሱ ወደ ቻፓ ገፅ ይወስዶታል'
                  : 'enter the deposit amount, click the deposit button then the system automatically redirects to the chapa page'}
              </span>
              {/* TODO: Add img */}
            </li>
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'የሚፈልጉትን የክፍያ መንገድ ይምረጡ፤ ተገቢውን የክፍያ መረጃዎች ሞልተው ገቢ ማድረግ ይቻላል'
                  : 'select the payment methods that you want and fill in the appropriate payment details and you can deposit'}
              </span>
              {/* TODO: Add img */}
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 19,
      title:
        i18n.resolvedLanguage == 'Am'
          ? 'እንዴት ወጪ ማድረግ ይቻላል?'
          : 'How to make a withdrawal?',
      body: (
        <div className="flex flex-col">
          {i18n.resolvedLanguage == 'Am' ? (
            <p>
              ወጪ ለማድረግ የ{configurations.name} መለያ ሊኖርዎት ይገባል። እነዚህን ቅደምተከተሎች
              ይከተሉ
            </p>
          ) : (
            <p>
              To make a withdrawal You must have a {configurations.name} account
              and follow these steps:-
            </p>
          )}
          <ul className="list-disc pl-2">
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? `ወደ ${configurations.name} መለያዎ ይግቡ`
                  : `log in to your ${configurations.name} account`}
              </span>
              {/* TODO: Add img */}
            </li>
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'ከላይኛው ቀኝ ጥግ  “ገንዘብ አስገባ” ትር ይሂዱ'
                  : 'select the deposit tab from the top right corner'}
              </span>
              {/* TODO: Add img */}
            </li>
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? '"ውጭ" የሚለውን ትር ይምረጡና ወጪ ለማድረግ መመሪያዎቹን ይከተሉ'
                  : 'select withdraw tab and follow the instructions to withdraw'}
              </span>
              {/* TODO: Add img */}
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 20,
      title:
        i18n.resolvedLanguage == 'Am'
          ? 'ከቅርንጫፍ ወጪ ለማድረግ እንዴት ይቻላል?'
          : 'How to request a local branch withdrawal?',
      body: (
        <div className="flex flex-col">
          {i18n.resolvedLanguage == 'Am' ? (
            <p>ከላይኛው ቀኝ ጥግ “ገንዘብ አስገባ” ትር ይሂዱ</p>
          ) : (
            <p>After you log in to your {configurations.name} account:-</p>
          )}
          <ul className="list-disc pl-2">
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'ከላይኛው ቀኝ ጥግ “ገንዘብ አስገባ” ትር ይሂዱ'
                  : 'select the deposit tab from the top right corner'}
              </span>
              {/* TODO: Add img */}
            </li>
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'በ"ወጪ" ትር ስር "ከቅርንጫፍ ወጪ"  ትርን ይምረጡ'
                  : 'under the withdraw tab select the branch payment tab '}
              </span>
              {/* TODO: Add img */}
            </li>
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'የወጪውን መጠን ካስገቡ በኋላ "ጠይቅ" የሚለውን ቁልፍ ይጫኑ'
                  : 'enter the withdrawal amount and click the request button '}
              </span>
              {/* TODO: Add img */}
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 21,
      title:
        i18n.resolvedLanguage == 'Am'
          ? 'ቻፓን በመጠቀም እንዴት ገንዘብ ማውጣት ይቻላል?'
          : 'How to withdraw using chapa?',
      body: (
        <div className="flex flex-col">
          {i18n.resolvedLanguage == 'Am' ? (
            <p>ወደ {configurations.name} መለያዎ ከገቡ በኋላ</p>
          ) : (
            <p>After you log in to your {configurations.name} account:-</p>
          )}
          <ul className="list-disc pl-2">
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'ከላይኛው ቀኝ ጥግ “ገንዘብ አስገባ” ትር ይሂዱ'
                  : 'select the deposit tab from the top right corner'}
              </span>
              {/* TODO: Add img */}
            </li>
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'በ"ወጪ" ትር ስር "ቻፓ "  ትርን ይምረጡ'
                  : 'under the withdraw tab select the chapa tab '}
              </span>
              {/* TODO: Add img */}
            </li>
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'ባንክ ይምረጡ፤ የወጪውን መጠን ያስገቡ ፤ ሌሎች መረጃዎችን በትክክል ይሙሉ፤ "ወጪ" የሚለውን ቁልፍ ይጫኑ'
                  : 'select a bank, enter the withdrawal amount, fill in other information correctly, and  click the withdraw button '}
              </span>
              {/* TODO: Add img */}
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 22,
      title:
        i18n.resolvedLanguage == 'Am' ? (
          <h3 className="m-0 text-lg font-semibold text-white ">
            የአገልግሎት (የምርት) እገዛ
          </h3>
        ) : (
          <h3 className="m-0 text-lg font-semibold text-white ">
            Product help
          </h3>
        ),
      body: '',
    },
    {
      id: 23,
      title:
        i18n.resolvedLanguage == 'Am' ? 'እንዴት ልወራረድ?' : 'How to place a bet?',
      body: (
        <div className="flex flex-col">
          {i18n.resolvedLanguage == 'Am' ? (
            <p>በእንድ ምርጫ ላይ ለመወራረድ</p>
          ) : (
            <p>To bet on a single selection:-</p>
          )}
          <ul className="list-disc pl-2">
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'ከታችኛው ግራ ጥግ ላይ "ጨዋታዎች"ን ይምረጡ'
                  : 'Choose a sport from the bottom left corner'}
              </span>
              {/* TODO: Add img */}
            </li>
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'የርስዎን የስፖርት ምርጫ ይምረጡ'
                  : 'Select your sport'}
              </span>
              {/* TODO: Add img */}
            </li>
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'የሚፈልጉትን ጨዋታ ይምረጡ'
                  : 'Click the game you wish to take that adds the selection to your bet slip'}
              </span>
              {/* TODO: Add img */}
            </li>
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'ወደ "ትኬት" ትር ይሂዱ	'
                  : 'go to the slip tab'}
              </span>
              {/* TODO: Add img */}
            </li>
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'ምርጫዎ ትክክል ከሆነ "place bet" የሚለውን ይጫኑ'
                  : 'Enter your stake whether your selection is correct, and select Place Bet'}
              </span>
              {/* TODO: Add img */}
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 24,
      title:
        i18n.resolvedLanguage == 'Am'
          ? 'የውርርዱን ውጤት እንዴት ማግኘት ይቻላል?'
          : 'How to find the result of bets?',
      body: (
        <div className="flex flex-col">
          {i18n.resolvedLanguage == 'Am' ? (
            <p>የውርርዱን ውጤት ማግኘት ይችላሉ</p>
          ) : (
            <p>You can find the result of the bets:-</p>
          )}
          <ul className="list-disc pl-2">
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'በታችኛው ወደሚገኘው "ትኬት" ትር ይሂዱ'
                  : 'go to the slip tab from the bottom navigation bar '}
              </span>
              {/* TODO: Add img */}
            </li>
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? '"ኩፖን ያረጋግጡ" የሚለውን ይምረጡ'
                  : 'Select check coupon '}
              </span>
              {/* TODO: Add img */}
            </li>
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'የኩፖኑ (የቲኬት) ቁጥሩን ያስገቡ ከዚያ “አምጣ”ቁልፍ ይጫኑ እና ውጤቱ ማየት ይችላሉ'
                  : 'enter the coupon (ticket) number,  click the retrieve button, and the result is displayed.'}
              </span>
              {/* TODO: Add img */}
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 25,
      title:
        i18n.resolvedLanguage == 'Am'
          ? 'ውርርድ እንዴት ማስተካከል ይችላል?'
          : 'How to edit a bet?',
      body: (
        <div className="flex flex-col">
          {i18n.resolvedLanguage == 'Am' ? (
            <p>ውርርድን ለማስተካከለል</p>
          ) : (
            <p>To edit a bet:-</p>
          )}
          <ul className="list-disc pl-2">
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'በታችኛው ወደሚገኘው "ትኬት" ትር ይሂዱ'
                  : 'go to the slip tab from the bottom navigation bar  '}
              </span>
              {/* TODO: Add img */}
            </li>
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'የእርስዎን ውርርድ ኩፖን ይፈልጉ  ስር  የኩፖን (ትኬት) ቁጥር  ያስገቡ፣ ”አምጣ” ቁልፉን ይጫኑና ውርርዱን በማስተካከል፣ እንደገና መወራረድ ይችላሉ'
                  : 'under retrieve your bet coupon, enter the coupon (ticket) number to retrieve the coupon field, click the retrieve button, and you can edit bet , place a bet again.'}
              </span>
              {/* TODO: Add img */}
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 26,
      title:
        i18n.resolvedLanguage == 'Am' ? 'ጃክፖት ምንድን ነው?' : 'What is a jackpot?',
      body: (
        <div className="flex flex-col">
          {i18n.resolvedLanguage == 'Am' ? (
            <p>
              የስፖርት ውርርድ ጃክፖት በዓለም ላይ ያሉ ትልልቅ አጫዋቾች ለተጫዋቾቻቸው የሚያቀርቡት ልዮ የሆነ
              ማስተዋወቂያ ሲሆን ይህም የብዙ ግጥሚያዎችን ትክክለኛ ውጤት መተንበይ ከቻሉ በሰፊው ጂክፖት ውርርዱን
              የማሸነፍ እድል ይሰጣቸዋል።
            </p>
          ) : (
            <p>
              A sports betting jackpot is a special promotion that some of the
              largest bookmakers in the world offer to their players, giving
              them a chance to win a huge jackpot if they can predict the right
              outcome of multiple matches.{' '}
            </p>
          )}
        </div>
      ),
    },
    {
      id: 27,
      title:
        i18n.resolvedLanguage == 'Am'
          ? 'ጃክፖት እንዴት መጫወት እችላለሁ?'
          : 'How to play the jackpot?',
      body: (
        <div className="flex flex-col">
          <ul className="list-disc pl-2">
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'ከላይ  ወደሚገኘው " ጃክፖት " ትር ይሂዱ'
                  : 'Go to the jackpots tab under the top navigation'}
              </span>
              {/* TODO: Add img */}
            </li>
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'የ"ጃክፖት ህጎች “ ይምረጡ እና መመሪያዎቹንም ይከተሉ'
                  : 'Select jackpot rules  and follow the instructions'}
              </span>
              {/* TODO: Add img */}
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 28,
      title:
        i18n.resolvedLanguage == 'Am'
          ? 'የጃክፖትን ውጤት እንዴት ማግኘት ይችላሉ?'
          : 'How to find a jackpot result?',
      body: (
        <div className="flex flex-col">
          <ul className="list-disc pl-2">
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'ከላይ  ወደሚገኘው " ጃክፖት " ትር ይሂዱ'
                  : 'Go to the jackpots tab under the top navigation'}
              </span>
              {/* TODO: Add img */}
            </li>
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? '"ጃክፖት ታሪክ"ን ይምረጡ ከዚያም ውጤቱ ማየት ይቻላል'
                  : 'Select jackpot history and the results display.'}
              </span>
              {/* TODO: Add img */}
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 29,
      title:
        i18n.resolvedLanguage == 'Am'
          ? 'ማከማቻ(ምንድን ነው?'
          : 'What is an accumulator?',
      body: (
        <div className="flex flex-col">
          {i18n.resolvedLanguage == 'Am' ? (
            <p>
              ማከማቻውርርድ ማለት በአንድ ውርርድ ከተጣመሩ በርካታ ምርጫዎች የተሰራ አንድ ውርርድ ነው። ለማሸነፍ
              ሁሉም ምርጫዎች ለውርርድ መግባት አለባቸው
            </p>
          ) : (
            <p>
              An accumulator bet is one bet made up of multiple selections that
              are combined in one bets. All of the selections need to come in
              for bet to win.
            </p>
          )}
        </div>
      ),
    },
    {
      id: 30,
      title:
        i18n.resolvedLanguage == 'Am'
          ? 'ማከማቻ እንዴት መጠቀም እንችላለን?'
          : 'How to use an accumulator?',
      body: (
        <div className="flex flex-col">
          <ul className="list-disc pl-2">
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? ' ከላይ  ወደሚገኘው " ማከማቻ " ትር ይሂዱ'
                  : 'Go to the accumulator tab under the top navigation'}
              </span>
              {/* TODO: Add img */}
            </li>
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'መደብ፣ የማሸነፍ መጠን፣ የግጥሚያ ቁጥር፣ የማስገቢያ ቀን እና የመጨረሻ ቀን ካስገቡ በኃላ "generate" የሚለውን ይጫኑ'
                  : 'Enter stake, possible win, no of matches, due date, and end date, and click generate'}
              </span>
              {/* TODO: Add img */}
            </li>
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'በምርጫዎ መሰረት የመጡትን ውርርዶች  መወራረድ ከፈለጉ "ወደ ትኬት አክል" የሚለውን በመጫን መወራረድ ይችላሉ'
                  : 'if you want to place a bet that the system generated based on your selection, click add to slip button, and you can place a bet. '}
              </span>
              {/* TODO: Add img */}
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 31,
      title:
        i18n.resolvedLanguage == 'Am'
          ? 'እየተመደቡ ያሉ(ትሬንዲንግ) ምንድን ነው እንዴትስ መጠቀም ይቻላል'
          : 'What is trending, and how to use it?',
      body: (
        <div className="flex flex-col">
          {i18n.resolvedLanguage == 'Am' ? (
            <p>
              ይህም በውርርድ የተሻለ ገንዘብ እንዲያገኙ እጅግ አጓጊ የሆኑትን ግጥሚያዎችነ ከመሪ ስታትስቲክስ ጋር
              ያጣመረ ነው{' '}
            </p>
          ) : (
            <p>
              It combines the most exciting matches with leading statistics to
              help you make more money with betting.
            </p>
          )}

          {i18n.resolvedLanguage == 'Am' ? (
            <p>እየተመደቡ ያሉ(ትሬንዲንግ) ለመጠቀም</p>
          ) : (
            <p>To use trending features::-</p>
          )}
          <ul className="list-disc pl-2">
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? ' ከላይ  ወደሚገኘው " እየተመደቡ ያሉ" ትር ይሂዱ'
                  : 'Goto trending tab under the top navigation'}
              </span>
              {/* TODO: Add img */}
            </li>
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'ግጥሚያዎች ይታያሉ እናም የተጣመሩትን ግጥሚያዎች ከፈለጉ "ወደ ትኬት አክል " ወይም "generate new " የሚለውን ቁልፍ ይጫኑ'
                  : 'matches are displayed, and either if you want the combined matches, click add to slip button or click generate new button'}
              </span>
              {/* TODO: Add img */}
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 32,
      title:
        i18n.resolvedLanguage == 'Am'
          ? 'ቨርቿል ውርርድ ምንድን ነው?'
          : 'What is trending, and how to use it?',
      body: (
        <div className="flex flex-col">
          {i18n.resolvedLanguage == 'Am' ? (
            <p>
              ቨርቿል የስፖርት ውርርድ በኮምፒውተር በተቀናበሩ ስፖርቶች እና ዝግጅቶች ላይ የሚደረግ የውርርድ አይነት
              ነው። ግጥሚያዎቹ ወይም ውድድሮቹ በጥያቄው ውስጥ ባለው ስፖርት ላይ የተመሰረቱ፤ ሙሉ ርዝመት የሌላቸው
              ሲሆኑ አዲሶቹም በየጥቂት ደቂቃዎች ይጀምራሉ። አሁን ላይ ያሉት ቨርቿል ስፖርቶች ጥቂት ሲሆኑ እንደ እግር
              ኳስ፣ የፈረስ እና ውሻ እሽቅድምድም፣ ኬኖ ወዘተ ናቸው.
            </p>
          ) : (
            <p>
              Virtual sports betting is a type of wagering made on
              computer-simulated sports and events. The matches or races,
              depending on the sport in question, are not full-length, and new
              ones start every few minutes. The virtual sports available are
              only a few now, such as Football. Dog and Horse Racing, keno and
              etc.
            </p>
          )}
        </div>
      ),
    },
    {
      id: 33,
      title:
        i18n.resolvedLanguage == 'Am'
          ? 'ቨርቿል ጨዋታዎችን እንዴት መጫወት ይቻላል?'
          : 'How to play virtual games?',
      body: (
        <div className="flex flex-col">
          {i18n.resolvedLanguage == 'Am' ? (
            <p>
              ቨርቿል ጨዋታዎችን ለመጫወት ወደ {configurations.name} መለያዎ መግባት ይኖርብዎታል፤ ከገቡ
              በኋላ
            </p>
          ) : (
            <p>
              To play virtual games you must login to your {configurations.name}{' '}
              account and after login :
            </p>
          )}
          <ul className="list-disc pl-2">
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'ከላይ  ወደሚገኘው " ቨርቿል " ትር ይሂዱ'
                  : 'Go to virtual tab under the top navigation'}
              </span>
              {/* TODO: Add img */}
            </li>
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'የሚፈልጉትን  ጨዋታ አይነት ይምረጡ'
                  : 'Select market'}
              </span>
              {/* TODO: Add img */}
            </li>
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'መዋራረድ የሚፈልጉትን ጨዋታ ይምረጡ ይህም ምርጫዎትን ወደ ትኬት የሚጨምር ነው'
                  : 'Select the game you wish to take , which adds the selection to your bet slip'}
              </span>
              {/* TODO: Add img */}
            </li>
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am' ? 'መደብ ያስገቡ' : 'Enter stake'}
              </span>
              {/* TODO: Add img */}
            </li>
            <li>
              <span>
                {i18n.resolvedLanguage == 'Am'
                  ? 'ምርጫው ልክ ከሆነ "place bet"ን ይምረጡ'
                  : 'If the selection is correct, select Place Bet.'}
              </span>
              {/* TODO: Add img */}
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 34,
      title:
        i18n.resolvedLanguage == 'Am'
          ? 'ቅሬታዎች፣ አለመግባባቶች እና የጥያቄዎች ሂደት'
          : 'Complaints, Disputes, and Queries Procedure',
      body: (
        <div className="flex flex-col">
          {i18n.resolvedLanguage == 'Am' ? (
            <p>
              የ {configurations.name} አገልግሎት ሲጠቀሙ ጥሩ ልምድ እንዳካበቱ ተስፋ እናደርጋለን፣
              በአገልግሎታችን ደስተኛ ካልሆኑ፣ እባክዎን በመጀመሪያ ደረጃ የደንበኛ ድጋፍ ሰጪን +251-11672160፣
              +251-11672164 ያግኙ። በ 24 ሰዓታት ውስጥ ለችግርዎ ምላሽ እንሰጣለን ።
            </p>
          ) : (
            <p>
              We do hope that, you have a great experience while using the{' '}
              {configurations.name}
              platform, how ever, if you are unhappy with our service, please
              contact customer support at first instance +251-11672160,
              +251-11672164. We will acknowledge and respond to your issue
              within 24 hours.
            </p>
          )}
          {/* TODO: add customer support img */}
        </div>
      ),
    },
    {
      id: 35,
      title: i18n.resolvedLanguage == 'Am' ? 'የቴክኒክ እገዛ' : 'Technical Support',
      body: (
        <div className="flex flex-col">
          {i18n.resolvedLanguage == 'Am' ? (
            <p>
              የ {configurations.name} አገልግሎት ሲጠቀሙ ማንኛውም ጥያቄዎች ካሉዎት ወይም ችግሮች
              ካጋጠሙዎት እባክዎ የደንበኛ አገልግሎትን በ +251-11672160፣ +251-11672164 ያግኙ።
            </p>
          ) : (
            <p>
              If you have any queries or incur difficulties when using our
              platform, please contact customer service at +251-11672160,
              +251-11672164
            </p>
          )}
          {/* TODO: add customer support img */}
        </div>
      ),
    },
  ];

  return (
    <div className=" flex h-full w-full flex-col items-center overflow-scroll md:min-h-screen md:overflow-auto">
      <div
        ref={faqRef}
        className="flex h-9 w-full  items-center bg-secondary-600 pr-2"
        onClick={() => {
          // console.log('change view to Type');
        }}
      >
        <div className="flex w-full items-center justify-center ">
          <span className="flex items-center text-xl uppercase text-white ">
            {'FREQUENTLY ASKED QUESTIONS'}
          </span>
        </div>
      </div>
      {/* TODO: Help Vidoes  */}
      {/* <div className="flex w-full flex-col items-center justify-center gap-y-1 overflow-hidden p-4 md:justify-center md:p-6">
        <EmblaCarousel style={'primary'} autoplay={false}>
          <div
            className="h-full  w-56 shrink-0 snap-center overflow-hidden rounded border-[1px] border-secondary-700 bg-secondary-900  "
            onClick={() => {
              setShowVideo(true);
              setURI('JrahuWKTtZE');
            }}
          >
            <div className="flex h-36 w-full items-center justify-center">
              <AiOutlinePlayCircle className=" text-4xl text-primary" />
            </div>
          </div>
          <div
            className="h-full  w-56 shrink-0 snap-center overflow-hidden rounded border-[1px] border-secondary-700 bg-secondary-900  "
            onClick={() => {
              setShowVideo(true);
              setURI('O6ipaQ7HQPE');
            }}
          >
            <div className="flex h-36 w-full items-center justify-center">
              <AiOutlinePlayCircle className=" text-4xl text-primary" />
            </div>
          </div>
          <div
            className="h-full  w-56 shrink-0 snap-center overflow-hidden rounded border-[1px] border-secondary-700 bg-secondary-900  "
            onClick={() => {
              setShowVideo(true);
              setURI('kzrHUUbCgmU');
            }}
          >
            <div className="flex h-36 w-full items-center justify-center">
              <AiOutlinePlayCircle className=" text-4xl text-primary" />
            </div>
          </div>
          <div
            className="h-full  w-56 shrink-0 snap-center overflow-hidden rounded border-[1px] border-secondary-700 bg-secondary-900  "
            onClick={() => {
              setShowVideo(true);
              setURI('uVcpbh7GHbk');
            }}
          >
            <div className="flex h-36 w-full items-center justify-center">
              <AiOutlinePlayCircle className=" text-4xl text-primary" />
            </div>
          </div>
        </EmblaCarousel>
      </div> */}
      {false && !loading && !faqs?.note && (
        <div className="flex h-full flex-col gap-6 p-8">
          {faqItems?.map((item) => {
            const isOpen = selectedItem === item.id && expand;
            if (!item.body)
              return (
                <div className="flex h-16 w-full items-center justify-center overflow-hidden rounded-lg bg-secondary-900 px-6 py-4 text-white shadow-md shadow-secondary-700">
                  {item.title}
                </div>
              );
            return (
              <Collapse
                isOpen={isOpen}
                key={item.id}
                title={item.title}
                onClick={() => changeCollapseFAQ(item.id)}
              >
                {item.body && (
                  <div className="flex p-6 text-white">{item.body}</div>
                )}
              </Collapse>
            );
          })}
        </div>
      )}

      <div className="flex  flex-col gap-3 px-6 py-4 text-white">
        {!loading && faqs?.note && <>{ReactHtmlParser(faqs?.note)}</>}
      </div>
      {!loading && !faqs?.note && (
        <Empty message={'FAQs are not available now.'} />
      )}

      <Modal
        visible={showVideo}
        onCancel={() => setShowVideo(false)}
        onOk={() => setShowVideo(false)}
        center={true}
      >
        <div className="flex h-full w-full flex-col items-center justify-center md:w-[620px] ">
          <YoutubeEmbed autoplay={true} videoID={URI} />
        </div>
      </Modal>
    </div>
  );
}
