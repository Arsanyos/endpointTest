import {
  Button,
  Col,
  Divider,
  Input,
  InputNumber,
  Row,
  Select,
  Tabs,
  message,
} from 'antd';
import Parser from 'html-react-parser';
import React, { useEffect, useRef, useState } from 'react';

import { useSelector } from 'react-redux';

import amole from '@assets/img/partners/amole.png';
import cbe from '@assets/img/partners/cbebirr.png';
import chapa from '@assets/img/partners/chapa.png';
import ebirr from '@assets/img/partners/ebirr.png';
import kacha from '@assets/img/partners/kacha.png';
import partner3 from '@assets/img/partners/lion.png';
import teleBirr from '@assets/img/partners/telebirr.jpg';
import wegagen from '@assets/img/partners/wegagen.png';
import santim from '@assets/img/partners/santim.png';
import mpesa from '@assets/img/partners/mpesa.png';
import unayo from '@assets/img/partners/unayo.png';
import yo_uganda from '@assets/img/partners/yo_uganda.png';
import arifpay from '@assets/img/partners/Arifpay_long.png';

import logo from '@assets/logo.png';
// import logo from '@assets/logo.svg';

import { AiFillPhone, AiOutlineGift, AiOutlineStop } from 'react-icons/ai';
import { BsBank2, BsCheck2Circle } from 'react-icons/bs';

import Modal from '@components/Modal';
import { useWallet } from '@hooks/useWallet';
import API from '@services/API';
import { useTranslation } from 'react-i18next';
import { FaDownload, FaLandmark, FaUpload } from 'react-icons/fa';
import { useCoreData } from '@hooks/useCoreData';
import { useUser } from '@hooks/useUser';
import { BiTransfer } from 'react-icons/bi';

const BankNote = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22.268"
    height="17.693"
    className={`${className} `}
    // {...className}
    viewBox="0 0 22.268 17.693"
  >
    <g id="banknotes" transform="translate(0.185 459.125)">
      <path
        id="Path_258"
        data-name="Path 258"
        d="M6.945-455.017C2.434-452.409.023-451-.011-450.931c-.116.215-.026.3.808.782.434.249.786.46.786.473s-.327.206-.722.43c-.778.443-.911.546-.911.7s.116.236.881.675c.378.215.7.408.722.425a3.583,3.583,0,0,1-.73.477,8.333,8.333,0,0,0-.816.511.262.262,0,0,0,.021.339c.095.116,7.845,4.563,7.948,4.563.069,0,.9-.473,3.961-2.243.391-.223,1.4-.812,2.256-1.3,2.462-1.422,5.585-3.227,6.659-3.845.541-.314,1.01-.6,1.04-.64a.269.269,0,0,0-.043-.361,7.96,7.96,0,0,0-.812-.5c-.4-.223-.722-.417-.722-.43s.327-.206.722-.43c.778-.443.911-.546.911-.7s-.116-.236-.881-.674c-.378-.219-.7-.408-.722-.43a4.154,4.154,0,0,1,.739-.477c1.19-.687,1.2-.64-.361-1.547C16.8-457.406,14-459,13.927-459,13.884-459,10.743-457.208,6.945-455.017Zm10.543-1.293c1.921,1.1,3.506,2.015,3.523,2.032s-4.722,2.793-5.035,2.943c-.06.026-.18-.021-.481-.189-.451-.258-.46-.262-.4-.284.026-.009.692-.391,1.482-.851,1.564-.9,1.615-.941,1.5-1.194a1.676,1.676,0,0,1-.064-.473,1,1,0,0,0-.043-.374c-.056-.056-3.1-1.809-3.261-1.873a.446.446,0,0,0-.344,0,2.238,2.238,0,0,1-1.113-.03c-.249-.069-.361-.082-.43-.052s-.769.434-1.594.911-1.512.864-1.53.864a5.1,5.1,0,0,1-.477-.254l-.438-.258.168-.1c1.4-.838,4.949-2.857,4.988-2.844S15.568-457.415,17.488-456.31Zm-4.155.339a2.48,2.48,0,0,0,1.005.017L14.55-456l1.414.812,1.409.812.026.254a.8.8,0,0,1,0,.288c-.013.017-.683.408-1.482.868l-1.452.838-.219-.125c-.58-.326-3.914-2.247-3.927-2.256s.477-.292,1.074-.636,1.186-.683,1.3-.756C12.938-456.048,12.986-456.053,13.334-455.971Zm-1.5,3.02c1.916,1.1,3.553,2.041,3.643,2.1l.159.1-.009,2.071-.013,2.071-.752.438a8.634,8.634,0,0,1-.8.443A10.272,10.272,0,0,1,14-447.756a13.86,13.86,0,0,0-.052-2.1c-.03-.039-.782-.481-1.667-.992-4.537-2.6-5.628-3.235-5.633-3.27a6.544,6.544,0,0,1,.765-.481c.644-.37.778-.43.851-.391C8.311-454.97,9.918-454.051,11.83-452.951ZM6.4-453.539c.211.125.391.236.4.249s-.649.412-1.461.881a16.61,16.61,0,0,0-1.525.941c-.052.09-.039.172.06.434a.475.475,0,0,1,.017.335.446.446,0,0,0,0,.262,15.071,15.071,0,0,0,1.719,1.053l1.671.958.253-.069a2.08,2.08,0,0,1,1.074.022,3.772,3.772,0,0,0,.387.086c.026,0,.473-.245.992-.541s1.229-.7,1.577-.907l.64-.37.176.1c.1.052.305.172.455.258l.275.159-.1.064c-.056.039-1.212.7-2.565,1.487l-2.466,1.422-3.527-2.024C2.507-449.849.9-450.772.887-450.79a3.617,3.617,0,0,1,.644-.412c.369-.215,1.512-.872,2.543-1.469s1.886-1.087,1.908-1.087A3.172,3.172,0,0,1,6.4-453.539Zm3.132,1.8,2.054,1.182c.009.009-.58.357-1.306.773l-1.323.765-.365-.073a2.412,2.412,0,0,0-1-.026l-.241.047-1.371-.782c-.752-.43-1.388-.8-1.418-.829a.714.714,0,0,1-.064-.3l-.013-.249,1.478-.855c.816-.468,1.491-.846,1.5-.842S8.41-452.384,9.531-451.739Zm10.853-.657a3.483,3.483,0,0,1,.627.408c-.064.06-4.735,2.741-4.778,2.741a2.816,2.816,0,0,1-.043-.752v-.752l.163-.1c.086-.056.808-.477,1.6-.928s1.5-.864,1.568-.907a.674.674,0,0,1,.168-.082C19.71-452.77,20.019-452.6,20.384-452.4Zm.009,2.269c.361.206.653.378.644.387s-1.027.6-2.269,1.31-2.32,1.336-2.393,1.383l-.142.086v-1.577l.378-.215c.206-.116.984-.567,1.723-1s1.362-.773,1.375-.769S20.032-450.334,20.393-450.128ZM5.059-447.7c1.564.9,2.874,1.633,2.917,1.633s.915-.485,1.942-1.078,2.23-1.285,2.668-1.542l.8-.46.017.756a5.194,5.194,0,0,1-.009.791c-.047.052-5.375,3.123-5.418,3.123-.026,0-1.426-.795-3.124-1.77s-3.282-1.882-3.532-2.024-.455-.262-.464-.266,1.323-.795,1.349-.795C2.214-449.333,3.495-448.6,5.059-447.7Zm0,2.256c1.787,1.027,2.849,1.611,2.922,1.611a5.737,5.737,0,0,0,.992-.507c3.394-1.963,4.327-2.5,4.4-2.526s.073.03.073.743v.769l-2.733,1.577L7.976-442.2,4.41-444.246a25.147,25.147,0,0,1-3.484-2.092l.657-.382a6.477,6.477,0,0,1,.623-.335C2.232-447.056,3.512-446.33,5.059-445.445Z"
        transform="translate(0 0)"
        fill="#fff"
        stroke="#fff"
        strokeWidth="0.25"
      />
      <path
        id="Path_259"
        data-name="Path 259"
        d="M310.748-363.643c-.726.421-.748.438-.748.584a.278.278,0,0,0,.266.305,6.39,6.39,0,0,0,1.4-.765.286.286,0,0,0-.06-.391.4.4,0,0,0-.185-.09A5.287,5.287,0,0,0,310.748-363.643Z"
        transform="translate(-296.731 -90.918)"
        fill="#fff"
        stroke="#fff"
        strokeWidth="0.25"
      />
      <path
        id="Path_260"
        data-name="Path 260"
        d="M166.82-282.592a6.109,6.109,0,0,0-.76.481.284.284,0,0,0,.223.451,8.086,8.086,0,0,0,1.517-.851.382.382,0,0,0,.095-.193.41.41,0,0,0-.288-.3A6.065,6.065,0,0,0,166.82-282.592Z"
        transform="translate(-158.921 -168.438)"
        fill="#fff"
        stroke="#fff"
        strokeWidth="0.25"
      />
    </g>
  </svg>
);
const GiftSVG = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="18.036"
    height="17.542"
    viewBox="0 0 18.036 17.542"
  >
    <g id="gift" transform="translate(-37.107 468.89)">
      <path
        dataName="Path 261"
        d="M43.825-468.837a2.239,2.239,0,0,0-1.381,1.1,2.133,2.133,0,0,0-.012,2.029c.074.14.14.268.148.285s-.994.037-2.227.041c-2.239.012-2.239.012-2.445.107a1.484,1.484,0,0,0-.619.565c-.161.276-.194.573-.177,1.67.012.986.016,1.014.12,1.237a1.265,1.265,0,0,0,.557.627l.223.124.008,4.4.012,4.4.1.186a1.505,1.505,0,0,0,.6.61l.206.111H53.329l.206-.111a1.505,1.505,0,0,0,.6-.61l.1-.186.012-4.4.008-4.4.223-.124a1.265,1.265,0,0,0,.557-.627l.107-.227v-1.134a4.5,4.5,0,0,0-.074-1.353,1.514,1.514,0,0,0-.7-.755l-.219-.1-2.239-.012c-1.233,0-2.235-.025-2.227-.041s.074-.144.148-.285a2.18,2.18,0,0,0-.755-2.841,1.986,1.986,0,0,0-1.1-.338,2.067,2.067,0,0,0-1.6.6l-.252.235-.243-.235a2.288,2.288,0,0,0-.944-.544A2.757,2.757,0,0,0,43.825-468.837Zm1.13.948a1.406,1.406,0,0,1,.61.61c.087.165.095.235.107,1.035l.012.862-.816-.017c-.755-.012-.833-.021-1.031-.111a1.342,1.342,0,0,1-.755-1.435,1.129,1.129,0,0,1,.342-.66A1.3,1.3,0,0,1,44.954-467.888Zm3.48-.017a1.343,1.343,0,0,1,.767,1.2,1.356,1.356,0,0,1-.767,1.2c-.2.091-.28.1-1.031.111l-.816.017v-.779c0-.854.025-.986.219-1.274A1.3,1.3,0,0,1,48.435-467.9ZM43.94-463.2l.008,1.311h-5.7l-.12-.12-.12-.12v-1.047c0-.9.008-1.06.066-1.142.148-.21.12-.206,3.089-.2l2.763.008Zm3.513-.008v1.32H44.814v-2.639h2.639Zm6.532-1.262c.268.111.272.136.272,1.295v1.047l-.12.12-.12.12h-5.7v-1.291c0-.713.012-1.307.029-1.32s1.258-.029,2.763-.029A20.613,20.613,0,0,1,53.985-464.466Zm-10.037,7.88v4.392l-2.412-.008-2.412-.012-.111-.115-.115-.111-.012-4.268-.008-4.268h5.072Zm3.505,0v4.392H44.814v-8.783h2.639Zm5.93-.124-.012,4.268-.115.111-.111.115-2.412.012-2.412.008v-8.783h5.072Z"
        transform="translate(0 0)"
        fill="currentColor"
      />
    </g>
  </svg>
);
const MoneySVG = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="17.351"
    height="17.365"
    viewBox="0 0 17.351 17.365"
  >
    <g id="money" transform="translate(-0.5 512.003)">
      <path
        id="Path_262"
        data-name="Path 262"
        d="M9-511.955c-.149.085-.17.17-.173.736v.529l-1.635.434a7.112,7.112,0,0,0-1.73.529.284.284,0,0,0-.095.193c0,.054.376,1.5.834,3.212l.834,3.114-.719.719-.722.722-.1-.115a1.131,1.131,0,0,0-.292-.207l-.193-.095H3.129c-1.842,0-1.886,0-2.038.071a1.02,1.02,0,0,0-.5.482l-.095.193v3.019c0,3,0,3.019.071,3.175a1.02,1.02,0,0,0,.482.5l.193.1H5.011l.193-.1a.978.978,0,0,0,.475-.488.428.428,0,0,1,.081-.146,3.407,3.407,0,0,1,.288.237,2.641,2.641,0,0,0,.448.319c.41.2.112.19,5.834.19s5.389.01,5.478-.187c.058-.129.058-16.863,0-16.992-.088-.2.142-.186-4.477-.186C9.868-512,9.067-511.992,9-511.955Zm8.17,8.635v8H15.963c-1.136,0-1.207,0-1.184-.061a1.317,1.317,0,0,0,0-.824c-.017-.044.014-.058.18-.075a1.155,1.155,0,0,0,.943-.678.916.916,0,0,0,.095-.465,1.074,1.074,0,0,0-.054-.38l-.058-.125.183-.085a1.187,1.187,0,0,0,.556-.56.9.9,0,0,0,.088-.478.882.882,0,0,0-.109-.512l-.112-.224v-4.382l-.078-.088a.327.327,0,0,0-.566.146c-.02.078-.034.828-.034,2.025v1.9l-.119-.014a.538.538,0,0,1-.119-.02s.024-.078.051-.17a.951.951,0,0,0-.017-.641,1.227,1.227,0,0,0-.6-.692,1.15,1.15,0,0,0-.59-.105l-.4-.014.193-.125a1.633,1.633,0,0,0,.726-1.6,1.65,1.65,0,0,0-1.357-1.357,1.633,1.633,0,0,0-1.845,1.845,1.656,1.656,0,0,0,.733,1.119l.2.129H10.861v-3.222c0-3.039,0-3.225.061-3.242a1.682,1.682,0,0,0,1.1-1.058l.041-.142h2.557l.041.142a1.68,1.68,0,0,0,1.1,1.058c.051.017.058.071.058.519,0,.729.061.875.363.875a.243.243,0,0,0,.234-.095c.081-.1.081-.1.081-.909v-.817l-.1-.1a.279.279,0,0,0-.214-.1.946.946,0,0,1-.926-.892.558.558,0,0,0-.1-.254l-.078-.092H11.6l-.078.092a.558.558,0,0,0-.1.254.946.946,0,0,1-.926.892.279.279,0,0,0-.214.1l-.1.1v6.892H9.5v-9.5H17.17Zm-8.343-6.04v.641l-.139.024a.557.557,0,0,0-.227.1c-.088.078-.092.088-.092.465,0,.353-.007.393-.092.536a.905.905,0,0,1-.485.424c-.231.1-.319.193-.322.336,0,.068,1.14,4.375,1.309,4.945.017.054-.014.061-.322.061H8.118l-.034-.129c-.017-.068-.095-.37-.173-.668s-.153-.577-.17-.621c-.034-.081-1.581-5.834-1.6-5.956-.01-.058.109-.1,1.041-.346.889-.241,1.6-.437,1.638-.451C8.823-510,8.826-509.713,8.826-509.36Zm0,3.605v1.4l-.305-1.119-.309-1.119.081-.047a2.806,2.806,0,0,0,.3-.278c.122-.125.224-.227.231-.231S8.826-506.522,8.823-505.755Zm4.918,1.584a.942.942,0,0,1,.427.417.7.7,0,0,1,.1.434.7.7,0,0,1-.1.434.866.866,0,0,1-.831.5.866.866,0,0,1-.831-.5.7.7,0,0,1-.1-.434.8.8,0,0,1,.207-.6,1.092,1.092,0,0,1,.5-.319A1.177,1.177,0,0,1,13.741-504.171ZM7.4-501.878c.119.465.153.556.241.634l.1.1h3.436a21.736,21.736,0,0,1,3.548.061.424.424,0,0,1,.258.414.424.424,0,0,1-.258.414,7.633,7.633,0,0,1-1.923.061H10.99l-.115.115a.308.308,0,0,0-.115.224.313.313,0,0,0,.115.224l.115.115h2.354c2.286,0,2.354,0,2.462.068a.466.466,0,0,1,0,.814c-.109.064-.176.068-2.462.068H10.99l-.115.115a.273.273,0,0,0,0,.448l.115.115h1.981c2.181,0,2.12-.007,2.279.214a.5.5,0,0,1,0,.522c-.159.22-.1.214-2.279.214H10.99l-.115.115a.3.3,0,0,0-.115.224.3.3,0,0,0,.115.224l.115.115h1.394c1.536,0,1.557,0,1.7.207a.47.47,0,0,1-.231.709c-.088.027-1.146.034-3.483.027-3.324-.01-3.358-.01-3.51-.081a4.3,4.3,0,0,1-.617-.475l-.468-.4v-4.684l.736-.736c.4-.407.739-.733.743-.729S7.324-502.177,7.4-501.878Zm-4.613,2.34c0,2.127,0,2.13.166,2.222a.469.469,0,0,0,.346,0c.166-.092.166-.1.166-2.222v-1.984h.678c.733,0,.821.017.9.173s.071,5.718,0,5.861c-.092.173-.1.173-1.92.173s-1.828,0-1.92-.173c-.068-.136-.068-5.735,0-5.861.088-.156.159-.17.9-.173h.685Z"
        transform="translate(0 0)"
        fill="currentColor"
      />
      <path
        id="Path_263"
        data-name="Path 263"
        d="M453.066-331.632a.342.342,0,0,0-.044.566.233.233,0,0,0,.227.061.331.331,0,0,0,.02-.655A.438.438,0,0,0,453.066-331.632Z"
        transform="translate(-437.05 -174.225)"
        fill="currentColor"
      />
      <path
        id="Path_264"
        data-name="Path 264"
        d="M68.377-59.819a.34.34,0,0,0,.166.631.359.359,0,0,0,.339-.336A.342.342,0,0,0,68.377-59.819Z"
        transform="translate(-65.415 -436.806)"
        fill="currentColor"
      />
    </g>
  </svg>
);
const BadgeSVG = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="14.36"
    height="19.195"
    viewBox="0 0 14.36 19.195"
  >
    <g id="badge" transform="translate(-64.584 511.712)">
      <path
        id="Path_255"
        data-name="Path 255"
        d="M71.4-511.652a4.018,4.018,0,0,0-1.005.66,3.879,3.879,0,0,1-.638.413,4.162,4.162,0,0,1-1.125.094c-1.058.026-1.122.041-1.4.308a2.565,2.565,0,0,0-.521,1.14,2.057,2.057,0,0,1-1.122,1.538c-.852.578-1.017.788-1.009,1.309a2.57,2.57,0,0,0,.24.994,2.141,2.141,0,0,1,0,1.988,2.539,2.539,0,0,0-.24,1.013.7.7,0,0,0,.1.488,2.69,2.69,0,0,0,.874.788c.758.521.885.679,1.092,1.35.071.236.184.585.248.773l.113.338-.773,1.981c-.424,1.088-.773,2.029-.773,2.089a.334.334,0,0,0,.109.225c.143.139.188.139,1.377,0,.514-.06.972-.112,1.017-.112.06,0,.266.218.8.836a9.221,9.221,0,0,0,.81.882.507.507,0,0,0,.188.045c.218,0,.259-.083,1.069-2.161l.776-1.984h.323l.761,1.951c.42,1.069.8,1.992.833,2.044a.362.362,0,0,0,.416.112,6.232,6.232,0,0,0,.829-.885c.608-.713.731-.84.818-.84.056,0,.514.052,1.02.112,1.122.139,1.2.139,1.332.026.2-.176.206-.176-.638-2.329l-.776-1.984.113-.341c.064-.188.169-.518.236-.735a4.218,4.218,0,0,1,.191-.54,2.556,2.556,0,0,1,.87-.818,2.875,2.875,0,0,0,.915-.818.7.7,0,0,0,.1-.488,2.539,2.539,0,0,0-.24-1.013,2.141,2.141,0,0,1,0-1.988,2.584,2.584,0,0,0,.24-.994c0-.506-.176-.746-.99-1.294a2.109,2.109,0,0,1-1.144-1.557,2.473,2.473,0,0,0-.551-1.17c-.27-.244-.431-.278-1.365-.274a2.109,2.109,0,0,1-1.864-.585,7.626,7.626,0,0,0-.776-.529A1.126,1.126,0,0,0,71.4-511.652Zm.6.78c.056.03.311.21.563.405a5.961,5.961,0,0,0,.72.488,2.664,2.664,0,0,0,1.5.244c.435,0,.825.011.874.023.131.037.248.281.42.878a2.8,2.8,0,0,0,1.4,1.947c.54.371.735.555.735.69a6.524,6.524,0,0,1-.225.732,2.768,2.768,0,0,0-.09,2.266,6.412,6.412,0,0,1,.315,1.009c0,.146-.146.289-.664.638a2.826,2.826,0,0,0-1.452,1.932c-.218.716-.263.825-.383.9-.086.053-.2.06-.836.053a2.851,2.851,0,0,0-2.344.761,4.028,4.028,0,0,1-.664.439c-.184.056-.341-.019-.8-.383a3.955,3.955,0,0,0-1.125-.7,2.845,2.845,0,0,0-1.17-.109,5.456,5.456,0,0,1-.945-.052c-.116-.06-.2-.251-.4-.9a6.091,6.091,0,0,0-.311-.844,3.157,3.157,0,0,0-1.1-1.069c-.555-.379-.713-.525-.713-.668a3.253,3.253,0,0,1,.154-.533,3.041,3.041,0,0,0,.071-2.742,6.727,6.727,0,0,1-.225-.735c0-.135.2-.319.735-.69a2.8,2.8,0,0,0,1.4-1.947c.173-.6.289-.84.42-.878.049-.011.443-.023.874-.023a2.687,2.687,0,0,0,1.5-.244,6.5,6.5,0,0,0,.728-.5C71.625-510.977,71.723-511.014,72-510.872Zm-3.444,12.96a2.893,2.893,0,0,1,1.324.158,7.54,7.54,0,0,1,1.02.765c0,.049-1.294,3.346-1.313,3.342s-.27-.3-.581-.664a6.726,6.726,0,0,0-.664-.716c-.086-.052-.188-.045-.987.049-.488.056-.9.094-.9.086s.9-2.386,1.125-2.926c.056-.139.06-.143.2-.112A6.552,6.552,0,0,0,68.557-497.911Zm7.941,1.489c.326.833.589,1.523.578,1.53s-.416-.03-.9-.086c-.8-.094-.9-.1-.987-.049a7.181,7.181,0,0,0-.664.716c-.308.364-.57.664-.581.664s-1.317-3.293-1.313-3.342a7.716,7.716,0,0,1,1.017-.765A2.575,2.575,0,0,1,74.9-497.9a4.423,4.423,0,0,0,.731-.015,1.1,1.1,0,0,1,.225-.026A11.238,11.238,0,0,1,76.5-496.422Z"
        fill="currentColor"
      />
      <path
        id="Path_256"
        data-name="Path 256"
        d="M129.342-442.657a4.952,4.952,0,0,0-4.374,4.077,6.26,6.26,0,0,0,0,1.7,4.788,4.788,0,0,0,1.369,2.607,4.851,4.851,0,0,0,2.513,1.377,6.8,6.8,0,0,0,1.951,0,4.952,4.952,0,0,0,3.935-5.222,4.542,4.542,0,0,0-.42-1.651,4.95,4.95,0,0,0-3.56-2.813A7.7,7.7,0,0,0,129.342-442.657Zm1.313.829a4.216,4.216,0,0,1,3.218,3.042,3.1,3.1,0,0,1,.1,1.058,3.273,3.273,0,0,1-.278,1.564,4.21,4.21,0,0,1-3.2,2.543,4.194,4.194,0,0,1-4.524-2.543,3.281,3.281,0,0,1-.278-1.564,2.848,2.848,0,0,1,.1-1.065A4.175,4.175,0,0,1,130.655-441.828Z"
        transform="translate(-58.066 -66.455)"
        fill="currentColor"
      />
      <path
        id="Path_257"
        data-name="Path 257"
        d="M182.5-386.815a3.157,3.157,0,0,0-.465.8l-.379.754-.735.105c-.405.056-.788.12-.855.139a.344.344,0,0,0-.236.281c-.026.221,0,.255.6.84l.6.581-.135.806c-.124.709-.135.825-.09.927a.393.393,0,0,0,.405.218,8.41,8.41,0,0,0,.761-.375c.368-.2.69-.356.713-.356s.349.165.724.364c.791.42.9.446,1.08.244.139-.154.139-.188-.023-1.1l-.128-.731.578-.563a5.237,5.237,0,0,0,.615-.664.419.419,0,0,0-.128-.428,5.27,5.27,0,0,0-.889-.176l-.8-.12L183.34-386c-.319-.634-.39-.75-.491-.8A.355.355,0,0,0,182.5-386.815Zm.431,1.7c.173.345.263.48.338.518a2.952,2.952,0,0,0,.585.12,1.935,1.935,0,0,1,.476.1,3.606,3.606,0,0,1-.356.353c-.458.424-.465.439-.345,1.1a2.285,2.285,0,0,1,.068.488c-.011-.007-.229-.116-.48-.248a3.065,3.065,0,0,0-.54-.233,2.961,2.961,0,0,0-.551.244c-.255.135-.469.244-.476.244s.03-.225.079-.5a2.892,2.892,0,0,0,.068-.608,1.613,1.613,0,0,0-.394-.465,3.754,3.754,0,0,1-.371-.379,2.305,2.305,0,0,1,.48-.094,2.959,2.959,0,0,0,.581-.12c.075-.038.165-.173.338-.518a4.016,4.016,0,0,1,.251-.469A4.01,4.01,0,0,1,182.935-385.116Z"
        transform="translate(-110.92 -120.174)"
        fill="currentColor"
      />
    </g>
  </svg>
);

const PAYMENT_TYPE_LOGOS = {
  hellocash: partner3,
  amole: amole,
  hellocashwegagen: wegagen,
  ebirr: ebirr,
  cbebirr: cbe,
  telebirr: teleBirr,
  santim: santim,
  chappa: chapa,
  kacha: kacha,
  mpesa_ke: mpesa,
  unayo: unayo,
  yo_uganda: yo_uganda,
  arifpay: arifpay,
};

const MIN_AMOUNT = 100;
const MAX_AMOUNT = 25000;
export default function Wallet() {
  // const [lang, setLang] = useState(t('lang') || 'Am');
  const [supportedPaymentMethods, setSupportedPaymentMethods] = useState({});
  const [supportedChappaBanks, setSupportedChappaBanks] = useState([]);
  const [supportedSantimDepositBanks, setSupportedSantimDepositBanks] =
    useState([]);
  const [supportedSantimWithdrawBanks, setSupportedSantimWithdrawBanks] =
    useState([]);
  const [supportedArifPayDepositBanks, setSupportedArifPayDepositBanks] =
    useState([]);
  const [supportedArifPayWithdrawBanks, setSupportedArifPayWithdrawBanks] =
    useState([]);
  const [selectedChappaBank, setSelectedChappaBank] = useState(null);
  const [transferType, setTransferType] = useState(null);
  const [hppUrl, setHppUrl] = useState(null);
  const [reqMode, setReqMode] = useState(null);
  const [billReferenceNumber, setBillReferenceNumber] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const [teleBirrURL, setTeleBirrURL] = useState(null);
  const [chappaURL, setChappaURL] = useState(null);
  const [checkoutURL, setCheckouURL] = useState(null);
  const [amountHC, setAmountHC] = useState(null);
  const [accountNumber, setAccountNumber] = useState(null);
  const [accountName, setAccountName] = useState(null);
  const [selectedTab, setSelectedTab] = useState(1);
  const [hppRequestId, setHppRequestId] = useState(null);
  const [referenceId, setReferenceId] = useState(null);
  const [amountWD, setAmountWD] = useState(null);
  const [amountT, setAmountT] = useState(null);
  const [withdrowAmmount, setWithdrowAmmount] = useState(null);
  const [transactionFee, setTransactionFee] = useState(null);
  const [netPay, setNetPay] = useState(null);
  const [wCode, setWCode] = useState(null);
  const [loadingDeposite, setLoadingDeposite] = useState(false);
  const [loadingRefresh, setLoadingRefresh] = useState(false);
  const [loadingWalletTransfer, setLoadingWalletTransfer] = useState(false);

  const [loadingTransfer, setLoadingTransfer] = useState(false);
  const [loadingBranchWithdraw, setLoadingBranchWithdraw] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showCBEBirrOTP, setShowCBEBirrOTP] = useState(false);

  const [depositVisible, setDepositVisible] = useState(false);
  const [withdrawVisible, setWithdrawVisible] = useState(false);
  const [branchWithdrawVisible, setBranchWithdrawVisible] = useState(false);
  const [forPhone, setForPhone] = useState('');

  const userDetail = useSelector((state) => state.user.userDetail);
  const [reciverPhone, setReciverPhone] = useState(null);
  const configurations = useSelector(
    (state) => state.configuration.configurations
  );
  // const minWithdraw = useSelector((state) => state.configuration.minWithdraw);
  // const minDeposit = useSelector((state) => state.configuration.minDeposit);

  const {
    requestWithdrow,
    withdrowHellocash,
    depositHellocash,
    transferToWallet,
  } = useWallet();
  const { getProfile } = useUser();

  const walletRef = useRef(null);
  const { t, i18n } = useTranslation();
  const { getConfiguration } = useCoreData();

  useEffect(() => {
    if (!configurations?.supported_payment_methods?.length > 0)
      getConfiguration();
  }, []);

  useEffect(() => {
    setInterval(() => getProfile(), 1000 * 500);
    return clearInterval();
  }, []);

  useEffect(() => {
    if (userDetail?.username) setReciverPhone(userDetail?.username);
  }, [userDetail]);
  useEffect(() => {
    let supported_payment_methods = {};
    configurations?.supported_payment_methods?.forEach((item) => {
      if (!supported_payment_methods[item.key]) {
        supported_payment_methods[item.key] = { ...item };
        if (item.key == 'hellocash') {
          supported_payment_methods[item.key].logo = partner3;
        } else if (item.key == 'amole') {
          supported_payment_methods[item.key].logo = amole;
        } else if (item.key == 'hellocashwegagen') {
          supported_payment_methods[item.key].logo = wegagen;
        } else if (item.key == 'ebirr') {
          supported_payment_methods[item.key].logo = ebirr;
        } else if (item.key == 'cbebirr') {
          supported_payment_methods[item.key].logo = cbe;
        } else if (item.key == 'telebirr') {
          supported_payment_methods[item.key].logo = teleBirr;
        } else if (item.key == 'chappa') {
          supported_payment_methods[item.key].logo = chapa;
        } else if (item.key == 'kacha') {
          supported_payment_methods[item.key].logo = kacha;
        } else if (item.key == 'santim') {
          supported_payment_methods[item.key].logo = santim;
        } else if (item.key == 'mpesa_ke') {
          supported_payment_methods[item.key].logo = mpesa;
        } else if (item.key == 'unayo') {
          supported_payment_methods[item.key].logo = unayo;
        } else if (item.key == 'yo_uganda') {
          supported_payment_methods[item.key].logo = yo_uganda;
        } else if (item.key == 'arifpay') {
          supported_payment_methods[item.key].logo = arifpay;
        }
      }
    });
    setSupportedPaymentMethods(supported_payment_methods);
    configurations?.supported_chappa_banks &&
      setSupportedChappaBanks(configurations?.supported_chappa_banks);
    setSupportedSantimDepositBanks(
      configurations?.supported_santimpay_deposit_banks
    );
    setSupportedSantimWithdrawBanks(
      configurations?.supported_santimpay_withdraw_banks
    );
    setSupportedArifPayDepositBanks(
      configurations?.supported_arifpay_deposit_banks
    );
    setSupportedArifPayWithdrawBanks(
      configurations?.supported_arifpay_withdraw_banks
    );
    setAmountHC(configurations.minimum_deposit_amount);
  }, [configurations, configurations?.supported_payment_methods]);

  useEffect(() => {
    if (chappaURL && document?.forms?.submitDepositChappa) {
      document.forms.submitDepositChappa.submit();
      // setChappaURL(null);
    }
    if (checkoutURL && document?.forms?.submitCheckout) {
      document.forms.submitCheckout.submit();
      // setChappaURL(null);
    }
  }, [chappaURL, checkoutURL]);
  useEffect(() => {
    if (teleBirrURL && document?.forms?.submitDepositTeleBirr) {
      document.forms.submitDepositTeleBirr.submit();
      // setTeleBirrURL(null);
    }
  }, [teleBirrURL]);

  const changeTransferType = (type) => {
    setTransferType(type);
    if (type != 'branchWithdraw') setSelectedTab(1);
    if (walletRef?.current == null) {
      setTimeout(() => {
        walletRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'start',
        });
      }, 300);
    }
    walletRef?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'start',
    });
  };

  const getSantimSupportedWithdrawPaymentType = (transferType) => {
    return supportedSantimWithdrawBanks?.some(
      (item) => item.code === transferType
    );
  };

  const getArifPaySupportedWithdrawPaymentType = (transferType) => {
    return supportedArifPayWithdrawBanks?.some(
      (item) => item.code === transferType
    );
  };
  const reqWithdrow = () => {
    // if (
    //   transferType.toLocaleLowerCase() == 'chappa' &&
    //   (amountWD < MIN_AMOUNT || amountWD > MAX_AMOUNT)
    // ) {
    //   return message.error(
    //     `Amount should be between ${MAX_AMOUNT} and ${MIN_AMOUNT} ${configurations.currency}`
    //   );
    // }
    // if (amountWD < MIN_AMOUNT || amountWD > MAX_AMOUNT) {
    //   return message.error(
    //     `Amount should be between ${MAX_AMOUNT} and ${MIN_AMOUNT} ${configurations.currency}`
    //   );
    // }
    if (
      transferType.toLocaleLowerCase() == 'chappa' &&
      selectedChappaBank == ''
    ) {
      return message.error('Please select bank');
    }
    if (transferType.toLocaleLowerCase() == 'chappa' && accountName == '') {
      return message.error('Please fill account name');
    }
    if (transferType.toLocaleLowerCase() == 'chappa' && accountNumber == '') {
      return message.error('Please fill account number');
    }
    if (transferType.toLocaleLowerCase() == 'santim' && accountNumber == '') {
      return message.error('Please fill account number');
    }
    if (transferType.toLocaleLowerCase() == 'arifpay' && accountNumber == '') {
      return message.error('Please fill account number');
    }
    if (amountWD == '') {
      return message.error(t('AmountandRecivercanNotbeBlank'));
    } else {
      setLoadingTransfer(true);

      // let bank = null;
      // const is_paymnet_type_in_santim = supportedSantimWithdrawBanks?.some(
      //   (item) => item.code === transferType
      // );
      // let selected_payment_method = is_paymnet_type_in_santim
      //   ? 'santim'
      //   : transferType;
      // if (is_paymnet_type_in_santim) {
      //   bank = transferType;
      // }

      let bank = null;
      let selected_payment_method = transferType;
      if (selectedProvider == 'santim') {
        selected_payment_method = selectedProvider;
        const is_paymnet_type_in_santim =
          getSantimSupportedWithdrawPaymentType(transferType);
        if (is_paymnet_type_in_santim) {
          bank = transferType;
        }
      }
      if (selectedProvider == 'arifpay') {
        selected_payment_method = selectedProvider;
        const is_paymnet_type_in_arifpay =
          getArifPaySupportedWithdrawPaymentType(transferType);
        if (is_paymnet_type_in_arifpay) {
          bank = transferType;
        }
      }

      if (transferType.toLocaleLowerCase() == 'chappa' && selectedChappaBank) {
        bank = selectedChappaBank;
      }

      withdrowHellocash(
        selected_payment_method,
        amountWD,
        reciverPhone,
        bank,
        accountName,
        accountNumber
      )
        ?.then((response) => {
          setLoadingTransfer(false);
          getProfile();
          if (transferType.toLocaleLowerCase() == 'chappa') {
            setChappaURL(response.chappaURL);
          } else if (transferType.toLocaleLowerCase() == 'telebirr') {
            setTeleBirrURL(response.teleBirrURL);
          } else if (transferType.toLocaleLowerCase() == 'santim') {
            // setTeleBirrURL(response.checkoutURL);
            // setCheckouURL(response.checkoutURL);
            message.success(t('TransferSuccessfull'));
            // getConfiguration();
            getProfile();
          } else if (transferType.toLocaleLowerCase() == 'arifpay') {
            // setTeleBirrURL(response.checkoutURL);
            // setCheckouURL(response.checkoutURL);
            message.success(t('TransferSuccessfull'));
          } else if (transferType.toLocaleLowerCase() == 'cbebirr') {
            setShowCBEBirrOTP(true);
            setReqMode('deposite');
            setBillReferenceNumber(response.billReferenceNumber);
          } else if (transferType.toLocaleLowerCase() == 'ebirr') {
            setReqMode('deposite');
            setHppRequestId(response.hppRequestId);
            setReferenceId(response.referenceId);
            setHppUrl(response.hppUrl);
          } else if (transferType.toLocaleLowerCase() == 'amole') {
            setTransactionId(response.transaction_id);
            setReqMode(response.reqMode);

            if (
              userDetail?.member?.wallet?.balance == 0 ||
              !userDetail.member ||
              !userDetail.member.wallet ||
              !userDetail.member.wallet.balance
            ) {
              window.firstDepositWrapper(
                userDetail.id,
                response.transaction_id,
                amountHC,
                t(configurations?.currency) ?? 'ETB'
              );
            }
          }
          // this.setState({ showCode: true, wCode: response.data.code,net_pay:response.data.net_pay,transaction_fee:response.data.transaction_fee });
          message.success(t('TransferSuccessfull'));
        })
        .catch((err) => {
          // console.log(err);
          setLoadingTransfer(false);
        });
    }
  };

  const getSantimSupportedDepositPaymentType = (transferType) => {
    return supportedSantimDepositBanks?.some(
      (item) => item.code === transferType
    );
  };
  const getArifPaySupportedDepositPaymentType = (transferType) => {
    return supportedArifPayDepositBanks?.some(
      (item) => item.code === transferType
    );
  };

  const depHellocash = () => {
    if (
      amountHC < configurations?.minimum_deposit_amount ||
      amountHC > configurations?.maximum_deposit_amount
    ) {
      message.error(
        `Amount should be between ${configurations?.minimum_deposit_amount} and ${configurations?.maximum_deposit_amount} ${configurations.currency}`
      );
      return;
    }
    if (transferType.toLocaleLowerCase() == 'chappa' && reciverPhone == '') {
      message.error('Please fill account number');
      return;
    }
    if (transferType.toLocaleLowerCase() == 'santim' && reciverPhone == '') {
      message.error('Please fill account number');
      return;
    }
    if (transferType.toLocaleLowerCase() == 'arifpay' && reciverPhone == '') {
      return message.error('Please fill account number');
    }
    if (amountHC == '') {
      message.error(t('AmountandRecivercanNotbeBlank'));
      return;
    } else {
      setLoadingDeposite(true);

      // let bank = null;
      // const is_paymnet_type_in_santim = supportedSantimDepositBanks?.some(
      //   (item) => item.code === transferType
      // );
      // let selected_payment_method = is_paymnet_type_in_santim
      //   ? 'santim'
      //   : transferType;
      // if (is_paymnet_type_in_santim) {
      //   bank = transferType;
      // }

      let bank = null;
      let selected_payment_method = transferType;
      if (selectedProvider == 'santim') {
        selected_payment_method = selectedProvider;
        const is_paymnet_type_in_santim =
          getSantimSupportedDepositPaymentType(transferType);
        if (is_paymnet_type_in_santim) {
          bank = transferType;
        }
      }

      if (selectedProvider == 'arifpay') {
        selected_payment_method = selectedProvider;
        const is_paymnet_type_in_arifpay =
          getArifPaySupportedDepositPaymentType(transferType);
        if (is_paymnet_type_in_arifpay) {
          bank = transferType;
        }
      }

      depositHellocash(selected_payment_method, amountHC, reciverPhone, bank)
        .then((response) => {
          getProfile();
          setLoadingDeposite(false);
          if (selected_payment_method.toLocaleLowerCase() == 'chappa') {
            setChappaURL(response.chappaURL);
          } else if (selected_payment_method.toLocaleLowerCase() == 'santim') {
            // setCheckouURL(response.checkoutURL);
            message.success(t('TransferSuccessfull'));
            // getConfiguration();
            getProfile();
          } else if (selected_payment_method.toLocaleLowerCase() == 'arifpay') {
            if (response.checkoutURL) {
              setCheckouURL(response.checkoutURL);
            } else message.success(t('TransferSuccessfull'));
          } else if (
            selected_payment_method.toLocaleLowerCase() == 'telebirr'
          ) {
            setChappaURL(response.teleBirrURL);
          } else if (selected_payment_method.toLocaleLowerCase() == 'cbebirr') {
            setShowCBEBirrOTP(true);
            setReqMode('deposite');
            setBillReferenceNumber(response.billReferenceNumber);
          } else if (selected_payment_method.toLocaleLowerCase() == 'ebirr') {
            setReqMode('deposite');
            setHppRequestId(response.hppRequestId);
            setReferenceId(response.referenceId);
            setHppUrl(response.hppUrl);
          } else if (selected_payment_method.toLocaleLowerCase() == 'amole') {
            setTransactionId(response.transaction_id);
            setReqMode(response.reqMode);

            if (
              userDetail?.member?.wallet?.balance == 0 ||
              !userDetail.member ||
              !userDetail.member.wallet ||
              !userDetail.member.wallet.balance
            ) {
              window.firstDepositWrapper(
                userDetail.id,
                response.transaction_id,
                amountHC,
                t(configurations?.currency) ?? 'ETB'
              );
            }
          } else return response;
        })
        .catch((err) => {
          // console.log(err);
          setLoadingDeposite(false);
        });
    }
  };

  const branchWithdraw = () => {
    setLoadingBranchWithdraw(true);
    requestWithdrow(withdrowAmmount)
      .then((response) => {
        getProfile();
        setLoadingBranchWithdraw(false);
        setTransactionFee(response.transaction_fee);
        setNetPay(response.net_pay);
        setWCode(response.wCode);
        setShowCode(true);
        message.success(t('TransferSuccessfull'));
      })
      .catch((err) => {
        // console.log(err);
        setLoadingBranchWithdraw(false);
      });
  };

  const transferHandler = () => {
    // TODO: uncomment below to validate min and max transfer amount locally.
    // if (
    //   amountT < configurations?.minimum_deposit_amount ||
    //   amountT > configurations?.maximum_deposit_amount
    // ) {
    //   return message.error(
    //     `Amount should be between ${configurations?.minimum_deposit_amount} and ${configurations?.maximum_deposit_amount} ${configurations.currency}`
    //   );
    // }
    if (forPhone == '') {
      return message.error('Please fill account number');
    }
    if (amountT == '') {
      return message.error(t('AmountandRecivercanNotbeBlank'));
    }
    // TODO: Implement withdraw modal
    setLoadingWalletTransfer(true);
    transferToWallet(amountT, forPhone)
      .then((response) => {
        setLoadingWalletTransfer(false);
        // setShowBetForMeWithdrawConfirm(true);
        // setShowBetForMeWithdraw(false);
        // setBetForMeTransactionID(response.uuid);
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
        setLoadingWalletTransfer(false);
      });
  };

  const onTabChange = (key) => {
    setSelectedTab(key);
  };

  const refreshWallet = async () => {
    setLoadingRefresh(true);
    getConfiguration();
    await getProfile();
    setLoadingRefresh(false);
  };

  const renderWithdraw = () => {
    return (
      <div>
        <img
          src={
            transferType == 'amole'
              ? amole
              : transferType == 'hellocash'
              ? partner3
              : transferType == 'ebirr'
              ? ebirr
              : transferType == 'cbebirr'
              ? cbe
              : transferType == 'chappa'
              ? chapa
              : transferType == 'santim' || selectedProvider == 'santim'
              ? santim
              : transferType == 'kacha'
              ? kacha
              : transferType == 'telebirr'
              ? teleBirr
              : transferType == 'hellocashwegagen'
              ? wegagen
              : transferType == 'unayo'
              ? unayo
              : transferType == 'mpesa_ke'
              ? mpesa
              : ''
          }
          width={transferType == 'telebirr' ? 70 : 50}
          height={40}
          style={{
            float: 'right',
            marginTop: -5,
            marginBottom: 0,
          }}
        />
        <p className=" uppercase text-font-light">{t('Amount')}</p>

        <InputNumber
          value={amountWD}
          style={{
            width: '100%',
            marginBottom: 10,
            // color:
            //   amountWD > MAX_AMOUNT || amountWD < configurations?.MIN_AMOUNT
            //     ? 'red'
            //     : '',
          }}
          // min={100}
          // max={25000}
          name="amountWD"
          onChange={(value) => {
            // console.log(value);
            setAmountWD(value);
          }}
        />
        {transferType == 'eBirr' ||
        transferType == 'telecirr' ||
        supportedSantimWithdrawBanks?.some(
          (item) => item.code === transferType
        ) ||
        supportedArifPayDepositBanks?.some(
          (item) => item.code === transferType
        ) ||
        transferType == 'amole' ? (
          <Input
            style={{ width: '100%', marginBottom: 10 }}
            disabled={!configurations.useridentifier_withdraw_editable}
            value={reciverPhone}
            placeholder={t('Phone')}
            name="reciverPhone"
            onChange={(e) => setReciverPhone(e.target.value)}
          />
        ) : (
          ''
        )}
        <p className="text-red-500/80">{t('TransactionFeeWillBeApplied')}</p>
        <Row span={24}>
          <Col span={12} md={12} xs={24}>
            <Button
              style={{
                width: '100%',
                color: 'font-light',
                backgroundColor: 'currentColor',
              }}
              loading={loadingTransfer}
              disabled={
                loadingTransfer ||
                parseInt(
                  userDetail.member ? userDetail.member.wallet.balance : 0
                ) == 0
              }
              onClick={() => {
                // this.confirmWithdraw(this.withdrowHellocash)
                // reqWithdrowHellocash();
                reqWithdrow();
              }}
            >
              {t('Withdraw')}
            </Button>
          </Col>
        </Row>
      </div>
    );
  };
  const renderDeposite = () => {
    return (
      <div>
        <img
          src={
            transferType == 'amole'
              ? amole
              : transferType == 'hellocash'
              ? partner3
              : transferType == 'ebirr'
              ? ebirr
              : transferType == 'cbebirr'
              ? cbe
              : transferType == 'chappa'
              ? chapa
              : transferType == 'santim' || selectedProvider == 'santim'
              ? santim
              : transferType == 'kacha'
              ? kacha
              : transferType == 'telebirr'
              ? teleBirr
              : transferType == 'hellocashwegagen'
              ? wegagen
              : transferType == 'unayo'
              ? unayo
              : transferType == 'mpesa_ke'
              ? mpesa
              : ''
          }
          width={transferType == 'telebirr' ? 70 : 50}
          height={40}
          style={{
            float: 'right',
            marginTop: -5,
            marginBottom: 0,
          }}
        />
        <p className="uppercase text-font-light">{t('Amount')}</p>

        <InputNumber
          value={amountHC}
          style={{
            width: '100%',
            marginBottom: 10,
            color:
              amountHC > configurations?.maximum_deposit_amount ||
              amountHC < configurations?.minimum_deposit_amount
                ? 'red'
                : '',
          }}
          // min={100}
          // max={25000}
          name="amountHC"
          onChange={(e) => {
            // changevalueN("amountHC", e);
            // this.setState({ amountHC: e });
            setAmountHC(e);
          }}
        />
        <br />
        {transferType == 'ebirr' ||
        transferType == 'telebirr' ||
        supportedSantimDepositBanks?.some(
          (item) => item.code === transferType
        ) ||
        transferType == 'amole' ? (
          <Input
            value={reciverPhone}
            disabled={!configurations.useridentifier_deposit_editable}
            style={{ width: '100%', marginBottom: 10 }}
            placeholder={t('Phone')}
            name="reciverPhone"
            onChange={(e) => setReciverPhone(e.target.value)}
          />
        ) : (
          ''
        )}
        <Row span={24}>
          <Col span={12} md={12} xs={24}>
            <Button
              style={{
                width: '100%',
                color: 'font-light',
                // paddingTop: 10,
                backgroundColor: 'currentColor',
              }}
              loading={loadingDeposite}
              onClick={() => {
                depHellocash();
              }}
            >
              {t('DepositeFromHellocash')}
            </Button>
          </Col>
        </Row>
      </div>
    );
  };

  const renderBranchWithdraw = () => {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex justify-between ">
          <p className="m-0 uppercase text-font-light">{t('Amount')}</p>
          {/* <BsBank2 className="text-2xl font-semibold text-font-light" /> */}
        </div>
        {/* <Input
          value={withdrowAmmount}
          name="withdrowAmmount"
          onChange={(value) => setWithdrowAmmount(value)}
        /> */}
        <InputNumber
          value={withdrowAmmount}
          style={{
            width: '100%',
            marginBottom: 10,
            // color:
            //   withdrowAmmount > MAX_AMOUNT || withdrowAmmount < MIN_AMOUNT
            //     ? 'red'
            //     : '',
          }}
          name="withdrowAmmount"
          onChange={(value) => setWithdrowAmmount(value)}
        />
        <p className="text-red-500/80">{t('TransactionFeeWillBeApplied')}</p>
        <button
          className="flex h-8 w-28 items-center justify-center gap-x-1 rounded bg-primary-700  px-1 py-2 text-center font-semibold capitalize text-font-dark"
          disabled={loadingBranchWithdraw}
          onClick={() => branchWithdraw()}
        >
          {loadingBranchWithdraw && (
            <div role="status">
              <svg
                aria-hidden="true"
                className="mr-2 h-4 w-4 animate-spin fill-font-dark text-active "
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          )}
          {t('Request')}
        </button>
      </div>
    );
  };

  const isBalanceValid = (() => {
    return (
      userDetail.member &&
      userDetail.member?.wallet?.balance >= 0 &&
      userDetail.member?.wallet?.nonwithdrawable >= 0 &&
      userDetail.member?.wallet?.payable >= 0 &&
      userDetail.member?.wallet?.points >= 0
    );
  })();

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="min-h-32 relative flex flex-col gap-4 py-4 px-4 md:px-8">
        <div className="flex flex-1 flex-col gap-y-1 rounded ">
          <button
            className="flex h-8 w-fit items-center justify-center gap-x-1 rounded bg-primary-700  px-2 py-2 text-center font-semibold uppercase text-font-dark"
            disabled={loadingRefresh}
            onClick={refreshWallet}
          >
            {loadingRefresh && (
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="mr-2 h-4 w-4 animate-spin fill-active text-font-light"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            )}
            {t('Refresh')}
          </button>
          <div className="text-font-darkg flex snap-x gap-y-2 gap-x-4 overflow-auto md:flex-wrap ">
            <div className="relative flex h-24 w-72 shrink-0 snap-center flex-col justify-center rounded bg-active p-4 pr-0 md:w-48 ">
              <div className="flex justify-between">
                <h1 className="flex text-active-font">{t('Balance')} </h1>
                <BankNote className="text-md mr-2 text-primary-100" />
              </div>
              <div className="flex items-center gap-2 border-t-[1px] border-font-light ">
                {isBalanceValid ? (
                  <span className="text-2xl font-semibold text-active-font">
                    {userDetail.member?.wallet?.balance
                      ? userDetail.member.wallet.balance.toFixed(2)
                      : '0.00'}
                  </span>
                ) : (
                  <AiOutlineStop className="mb-1 text-active-font" />
                )}
                <span className="text-md mb-1 flex items-end text-active-font">
                  {t(configurations?.currency)}
                </span>
              </div>
            </div>

            <div className="relative flex h-24 w-72 shrink-0 snap-center flex-col justify-center rounded bg-primary-500 p-4 pr-0 md:w-48 ">
              <div className="flex justify-between ">
                <h1
                  className="flex text-font-dark
                "
                >
                  {t('Bonus')}{' '}
                </h1>
                <GiftSVG className="text-md mr-2 text-font-light " />
              </div>
              <div className="flex items-center gap-2 border-t-[1px] ">
                {isBalanceValid ? (
                  <span className="text-2xl font-semibold  text-font-dark">
                    {userDetail.member?.wallet?.nonwithdrawable
                      ? userDetail.member.wallet.nonwithdrawable.toFixed(2)
                      : '0.00'}
                  </span>
                ) : (
                  <AiOutlineStop className="mb-1 text-font-dark" />
                )}
                <span
                  className="text-md 
                mb-1 flex items-end text-font-dark"
                >
                  {t(configurations?.currency)}
                </span>
              </div>
            </div>

            <div className="relative flex h-24 w-72 shrink-0 snap-center flex-col justify-center rounded bg-primary-500 p-4 pr-0 md:w-48 ">
              <div className="flex justify-between ">
                <h1
                  className="flex text-font-dark
                "
                >
                  {t('Payable')}{' '}
                </h1>
                <MoneySVG className="text-md mr-2 text-font-light " />
              </div>
              <div className="flex items-center gap-2 border-t-[1px] ">
                {isBalanceValid ? (
                  <span
                    className="text-2xl font-semibold
                    text-font-dark"
                  >
                    {userDetail.member?.wallet?.payable
                      ? userDetail.member.wallet.payable.toFixed(2)
                      : '0.00'}
                  </span>
                ) : (
                  <AiOutlineStop className="mb-1 text-font-dark" />
                )}
                <span
                  className="text-md
                 mb-1 flex items-end text-font-dark"
                >
                  {t(configurations?.currency)}
                </span>
              </div>
            </div>

            <div className="relative flex h-24 w-72 shrink-0 snap-center flex-col justify-center rounded bg-primary-500 p-4 pr-0 md:w-48 ">
              <div className="flex justify-between ">
                <h1
                  className="flex text-font-dark
                "
                >
                  {configurations?.name + ' ' + t('Points')}{' '}
                </h1>
                <BadgeSVG className="text-md mr-2 text-font-light " />
              </div>
              <div className="flex items-center gap-2 border-t-[1px] ">
                {isBalanceValid ? (
                  <span
                    className="text-2xl font-semibold
                    text-font-dark"
                  >
                    {userDetail.member?.wallet?.points
                      ? userDetail.member.wallet.points.toFixed(2)
                      : '0.00'}
                  </span>
                ) : (
                  <AiOutlineStop className="mb-1 text-font-dark" />
                )}
                <span
                  className="text-md
                 mb-1 flex items-end text-font-dark"
                >
                  {t(configurations?.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-4 px-4 md:px-8">
        <ul className="mb-0 flex h-9 w-full gap-[2px] text-center text-sm font-medium text-gray-200 md:w-fit ">
          <li
            key={1}
            onClick={() => onTabChange(1)}
            className={` ${
              selectedTab == 1
                ? '  bg-active text-active-font'
                : 'bg-primary-700 hover:text-font-dark '
            } flex h-full w-full flex-1 cursor-pointer items-center justify-start gap-x-1 ${
              userDetail?.member?.member_type == 1 ? 'rounded-tl' : ''
            } rounded-tl px-2 text-center duration-500 md:w-32`}
          >
            <FaDownload />
            <span>{t('Deposite')}</span>
          </li>

          <li
            key={2}
            onClick={() => onTabChange(2)}
            className={` ${
              selectedTab == 2
                ? ' bg-active text-active-font'
                : 'bg-primary-700  hover:text-font-dark '
            } flex h-full w-full flex-1 cursor-pointer items-center justify-start gap-x-1 px-2 text-center duration-500 last:rounded-tr md:w-32`}
          >
            <FaUpload />
            <span>{t('Withdraw')}</span>
          </li>
          {configurations?.transfer_enabled == true && (
            <li
              key={3}
              onClick={() => onTabChange(3)}
              className={` ${
                selectedTab == 3
                  ? 'bg-active text-active-font'
                  : 'bg-primary-700 hover:text-font-dark'
              } flex h-full w-full flex-1 cursor-pointer items-center justify-start gap-x-1 px-2 text-center duration-500 last:rounded-tr  hover:text-font-dark md:w-32`}
            >
              <BiTransfer />
              <span>{t('Transfer')}</span>
            </li>
          )}
        </ul>
        <div className="flex min-h-max flex-1 flex-col items-center justify-center rounded-b bg-primary-200  px-2 md:rounded-tr">
          <div className=" flex w-full flex-wrap gap-2 py-4 ">
            {/* Arif */}
            {selectedTab == 1 &&
              supportedArifPayDepositBanks?.map((item, index) => {
                return (
                  <>
                    <div
                      key={index}
                      className="relative flex w-full text-font-dark md:w-56"
                    >
                      <div className="absolute top-1 left-1">
                        <FaDownload className="text-xs" />
                      </div>
                      <div
                        className="flex h-16 w-full flex-1 cursor-pointer items-center justify-between overflow-hidden rounded bg-primary-500 px-4 py-2 shadow-sm "
                        onClick={() => {
                          setTransferType(item.code);
                          setSelectedProvider('arifpay');
                          setDepositVisible(true);
                        }}
                      >
                        <div className="flex gap-x-0.5">
                          {PAYMENT_TYPE_LOGOS[
                            item.code.toLocaleLowerCase().replace(/\s/g, '')
                          ] && (
                            <img
                              src={
                                PAYMENT_TYPE_LOGOS[
                                  item.code
                                    .toLocaleLowerCase()
                                    .replace(/\s/g, '')
                                ]
                              }
                              width={24}
                              // height={20}
                            />
                          )}
                          <span>{item.name}</span>
                        </div>

                        {supportedPaymentMethods[item.key]?.logo ? (
                          <img
                            src={supportedPaymentMethods[item.key]?.logo}
                            width={60}
                            height={30}
                          />
                        ) : (
                          <img src={arifpay} width={60} height={30} />
                        )}
                      </div>
                    </div>
                  </>
                );
              })}
            {selectedTab == 1 &&
              supportedSantimDepositBanks?.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="relative flex w-full text-font-dark md:w-56"
                  >
                    <div className="absolute top-1 left-1">
                      <FaDownload className="text-xs" />
                    </div>
                    <div
                      className="flex h-16 w-full flex-1 cursor-pointer items-center justify-between overflow-hidden rounded bg-primary-500 px-4 py-2 shadow-sm "
                      onClick={() => {
                        setTransferType(item.code);
                        setSelectedProvider('santim');
                        setDepositVisible(true);
                      }}
                    >
                      <div className="flex gap-x-0.5">
                        {PAYMENT_TYPE_LOGOS[
                          item.code.toLocaleLowerCase().replace(/\s/g, '')
                        ] && (
                          <img
                            src={
                              PAYMENT_TYPE_LOGOS[
                                item.code.toLocaleLowerCase().replace(/\s/g, '')
                              ]
                            }
                            width={24}
                            // height={20}
                          />
                        )}
                        <span>{item.name}</span>
                      </div>

                      {supportedPaymentMethods[item.key]?.logo ? (
                        <img
                          src={supportedPaymentMethods[item.key]?.logo}
                          width={60}
                          height={30}
                        />
                      ) : (
                        <img src={santim} width={60} height={30} />
                      )}
                    </div>
                  </div>
                );
              })}
            {selectedTab == 2 &&
              supportedSantimWithdrawBanks?.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="relative flex w-full text-font-dark md:w-56"
                  >
                    <div className="absolute top-1 left-1">
                      <FaUpload className="text-xs" />
                    </div>
                    <div
                      className="flex h-16 w-full flex-1 cursor-pointer items-center justify-between overflow-hidden rounded bg-primary-500 px-4 py-2 shadow-sm "
                      onClick={() => {
                        setTransferType(item.code);
                        setSelectedProvider('santim');
                        setWithdrawVisible(true);
                      }}
                    >
                      <div className="flex gap-x-0.5">
                        {PAYMENT_TYPE_LOGOS[
                          item.code.toLocaleLowerCase().replace(/\s/g, '')
                        ] && (
                          <img
                            src={
                              PAYMENT_TYPE_LOGOS[
                                item.code.toLocaleLowerCase().replace(/\s/g, '')
                              ]
                            }
                            width={24}
                            // height={20}
                          />
                        )}
                        <span>{item.name}</span>
                      </div>
                      {supportedPaymentMethods[item.key]?.logo ? (
                        <img
                          src={supportedPaymentMethods[item.key]?.logo}
                          width={60}
                          height={30}
                        />
                      ) : (
                        <img src={santim} width={60} height={30} />
                      )}
                    </div>
                  </div>
                );
              })}

            {/* Arif */}
            {selectedTab == 2 &&
              supportedArifPayWithdrawBanks?.map((item, index) => {
                return (
                  <>
                    <div
                      key={index}
                      className="relative flex w-full text-font-dark md:w-56"
                    >
                      <div className="absolute top-1 left-1">
                        <FaUpload className="text-xs" />
                      </div>
                      <div
                        className="flex h-16 w-full flex-1 cursor-pointer items-center justify-between overflow-hidden rounded bg-primary-500 px-4 py-2 shadow-sm "
                        onClick={() => {
                          setTransferType(item.code);
                          setSelectedProvider('arifpay');
                          setWithdrawVisible(true);
                        }}
                      >
                        <div className="flex gap-x-0.5">
                          {PAYMENT_TYPE_LOGOS[
                            item.code.toLocaleLowerCase().replace(/\s/g, '')
                          ] && (
                            <img
                              src={
                                PAYMENT_TYPE_LOGOS[
                                  item.code
                                    .toLocaleLowerCase()
                                    .replace(/\s/g, '')
                                ]
                              }
                              width={24}
                              // height={20}
                            />
                          )}
                          <span>{item.name}</span>
                        </div>
                        {supportedPaymentMethods[item.key]?.logo ? (
                          <img
                            src={supportedPaymentMethods[item.key]?.logo}
                            width={60}
                            height={30}
                          />
                        ) : (
                          <img src={arifpay} width={60} height={30} />
                        )}
                      </div>
                    </div>
                  </>
                );
              })}

            {selectedTab != 3 &&
              configurations?.supported_payment_methods?.map((item, index) => {
                if (
                  item.enable_option == 4 ||
                  item.key == 'santim' ||
                  item.key === 'arifpay' ||
                  (item.enable_option != selectedTab && item.enable_option != 3)
                ) {
                  return null;
                }
                return (
                  <div
                    key={index}
                    className="relative flex w-full text-font-dark md:w-56"
                  >
                    <div className="absolute top-1 left-1">
                      {selectedTab == 1 ? (
                        <FaDownload className="text-xs" />
                      ) : (
                        <FaUpload className="text-xs" />
                      )}
                    </div>
                    <div
                      key={index}
                      className="flex h-16 w-full flex-1 cursor-pointer items-center justify-between overflow-hidden rounded bg-primary-500 px-4 py-2 shadow-sm "
                      onClick={() => {
                        // changeTransferType(item.key);
                        setSelectedProvider(null);
                        setTransferType(item.key);
                        if (selectedTab == 1) setDepositVisible(true);
                        if (selectedTab == 2 && item.key != 'branch')
                          setWithdrawVisible(true);
                        if (selectedTab == 2 && item.key == 'branch')
                          setBranchWithdrawVisible(true);
                      }}
                    >
                      <span>{item.name}</span>
                      {supportedPaymentMethods[item.key]?.logo ? (
                        <img
                          src={supportedPaymentMethods[item.key]?.logo}
                          width={60}
                          height={30}
                        />
                      ) : (
                        <FaLandmark className="text-xl " />
                      )}
                    </div>
                  </div>
                );
              })}

            {selectedTab == 3 && (
              <div className="flex w-full flex-col gap-2 text-white md:w-80">
                <Input
                  value={forPhone}
                  style={{ width: '100%', marginBottom: 10 }}
                  placeholder={t('ReciverPhone')}
                  name="forPhone"
                  onChange={(e) => setForPhone(e.target.value)}
                />
                <div className="flex  w-full flex-col gap-1">
                  <InputNumber
                    value={amountT}
                    placeholder={t('Amount')}
                    style={{
                      width: '100%',
                      marginBottom: 10,
                      // color:
                      //   amountT > configurations?.maximum_deposit_amount ||
                      //   amountT < configurations?.minimum_deposit_amount
                      //     ? 'red'
                      //     : '',
                    }}
                    name="setAmountT"
                    onChange={(e) => {
                      setAmountT(e);
                    }}
                  />
                </div>
                <div className="flex w-full justify-start">
                  <button
                    onClick={transferHandler}
                    disabled={loadingWalletTransfer}
                    className="flex h-8 items-center justify-center gap-2 rounded bg-primary-500 px-4 text-white"
                  >
                    {loadingWalletTransfer && (
                      <div role="status">
                        <svg
                          aria-hidden="true"
                          className="mr-2 h-4 w-4 animate-spin fill-primary-200 text-active"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                        <span className="sr-only">Loading...</span>
                      </div>
                    )}
                    {t('Transfer')}
                  </button>
                </div>
              </div>
            )}

            {/* {supportedPaymentMethods['hellocash'] &&
            supportedPaymentMethods['hellocash'].enable_option != 4 ? (
              <div className="flex w-full ">
                <div
                  className="flex h-16 w-full cursor-pointer items-center justify-between overflow-hidden rounded bg-primary-500 px-4 py-2 shadow-sm"
                  onClick={() => {
                    changeTransferType('hellocash');
                    if (selectedTab == 1) renderDeposite();
                    if (selectedTab == 2) renderWithdraw();
                  }}
                >
                  <span>{t('HellocashLion')}</span>
                  <img src={partner3} width={40} height={40} />
                </div>
              </div>
            ) : null} */}
          </div>
        </div>
      </div>

      {/* ebirr Hidden Form */}
      <form
        name="submitDeposit"
        target={''}
        type="hidden"
        action={hppUrl}
        method="POST"
      >
        <input type="hidden" name="hppRequestId" value={hppRequestId} />
        <input type="hidden" name="referenceId" value={referenceId} />
        <input type="hidden" name="hppRespDataFormat" value="1" />
      </form>

      {/* teleBirr Hidden Form */}
      <form
        name="submitDepositTeleBirr"
        target={'_self'}
        type="hidden"
        rel="noopener noreferrer"
        action={teleBirrURL}
        method="GET"
      >
        <input type="hidden" name="hppRespDataFormat" value="1" />
      </form>

      {/* teleBirr Hidden Form */}
      <form
        name="submitDepositChappa"
        target={'_self'}
        rel="noopener noreferrer"
        type="hidden"
        action={chappaURL}
        method="GET"
      >
        <input type="hidden" name="hppRespDataFormat" value="1" />
      </form>
      {/* santim Hidden Form */}
      <form
        name="submitCheckout"
        target={'_self'}
        rel="noopener noreferrer"
        type="hidden"
        action={checkoutURL}
        method="GET"
      >
        <input
          type="hidden"
          name="data"
          value={checkoutURL?.split('data=')[1]}
        />
        {/* https://services.santimpay.com/?data=eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eG5JZCI6ImMzOWUzNGZlLTgyNWItNDA5ZS05OTMxLTQyOWExODVlOTUyYSIsIm1lcklkIjoiOWUyZGFiNjQtZTJiYi00ODM3LTliODUtZDg1NWRkODc4ZDJiIiwibWVyTmFtZSI6IlNhbnRpbXBheSBUZXN0IENvbXBhbnkiLCJhZGRyZXNzIjoiQWRkaXMgQWJhYmEiLCJhbW91bnQiOiIxMDAuMDAiLCJjdXJyZW5jeSI6IkVUQiIsInJlYXNvbiI6IlNhbnQtRGVwb3NpdCIsImNvbW1pc3Npb25BbW91bnQiOiIxLjAwIiwidG90YWxBbW91bnQiOiIxMDEuMDAiLCJwaG9uZU51bWJlciI6IisyNTE5MDEwMDAwNTEiLCJleHAiOjE2ODMxMzA5MTMsImlzcyI6InNlcnZpY2VzLnNhbnRpbXBheS5jb20ifQ.P1o0ptSkZjtbqYjwqZIopeLS5Pg0VoMH6PKOSlHnKudFZWX9d1MxFKmnpDoeC_SYmMnBSG6h1KTIWPR4ot_Jgg */}
      </form>

      <Modal
        visible={depositVisible}
        onCancel={() => setDepositVisible(false)}
        onOk={() => setDepositVisible(false)}
      >
        <div className="w-full">
          <div className="flex h-20 w-full items-center justify-start bg-header-container px-4">
            <img src={logo} className="h-12" />
          </div>
          <div className="flex w-full items-center justify-between gap-2 px-4 py-2">
            <h2 className="m-0 p-0 text-lg uppercase">{t('Deposite')}</h2>
            {transferType != 'branch' ? (
              <img
                src={
                  PAYMENT_TYPE_LOGOS[
                    transferType
                      ? transferType.toLocaleLowerCase()
                      : selectedProvider
                  ]
                }
                width={transferType == 'telebirr' ? 70 : 50}
                height={40}
              />
            ) : (
              <FaLandmark className="text-xl" />
            )}
          </div>
          {transferType != 'branch' ? (
            <div className=" mb-4 flex w-full flex-col flex-wrap justify-center px-4 md:w-80">
              <div className="m-0 flex w-full flex-col items-start justify-center gap-2">
                <div className="flex  w-full flex-col gap-1">
                  <p className="m-0 p-0">{t('Amount')}</p>
                  <InputNumber
                    value={amountHC}
                    style={{
                      width: '100%',
                      marginBottom: 10,
                      color:
                        amountHC > configurations?.maximum_deposit_amount ||
                        amountHC < configurations?.minimum_deposit_amount
                          ? 'red'
                          : '',
                    }}
                    // min={100}
                    // max={25000}
                    name="amountHC"
                    onChange={(e) => {
                      setAmountHC(e);
                    }}
                  />
                </div>
                {transferType == 'ebirr' ||
                transferType == 'telebirr' ||
                supportedSantimDepositBanks?.some(
                  (item) => item.code === transferType
                ) ||
                transferType == 'amole' ? (
                  <Input
                    value={
                      !configurations.useridentifier_deposit_editable ||
                      configurations.is_mobile_meny
                        ? userDetail.username
                        : reciverPhone
                    }
                    disabled={!configurations.useridentifier_deposit_editable}
                    style={{ width: '100%', marginBottom: 10 }}
                    placeholder={t('Phone')}
                    name="reciverPhone"
                    onChange={(e) => setReciverPhone(e.target.value)}
                  />
                ) : (
                  ''
                )}
              </div>
              <p className="text-red-500/80">
                {t('TransactionFeeWillBeApplied')}
              </p>
              <div className="mt-4 flex flex-col items-start justify-center gap-y-2 gap-x-4">
                <button
                  className="flex h-8 w-28 items-center justify-center gap-x-1 rounded bg-secondary-500 py-2 px-1 text-center font-semibold uppercase text-font-dark"
                  disabled={loadingDeposite}
                  onClick={() => depHellocash()}
                >
                  {loadingDeposite && (
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        className="mr-2 h-4 w-4 animate-spin fill-font-dark text-active "
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="sr-only">Loading...</span>
                    </div>
                  )}
                  {t('Deposite')}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex py-2 px-4">
              Please find a nearby {configurations.name} shop to deposit.
              <br /> Thank you.
            </div>
          )}
        </div>
      </Modal>
      <Modal
        visible={withdrawVisible}
        onCancel={() => setWithdrawVisible(false)}
        onOk={() => setWithdrawVisible(false)}
      >
        <div className=" w-full md:w-full ">
          <div className="flex h-20 w-full items-center justify-start bg-header-container px-4">
            <img src={logo} className="h-12" />
          </div>
          <div className="flex w-full items-center justify-between gap-2 px-4 py-2">
            <h2 className="m-0 p-0 text-lg uppercase">{t('Withdraw')}</h2>
            {transferType != 'branch' ? (
              <img
                src={PAYMENT_TYPE_LOGOS[transferType ?? selectedProvider]}
                width={transferType == 'telebirr' ? 70 : 50}
                height={40}
              />
            ) : (
              <FaLandmark className="text-xl" />
            )}
          </div>
          <div className="flex w-full flex-col flex-wrap justify-center gap-y-1 px-4 pb-4 md:w-80">
            <div className="flex w-full flex-col items-start justify-center gap-2">
              {transferType == 'chappa' && (
                <p className="m-0 p-0">{'Select a Bank'}</p>
              )}
              {transferType == 'chappa' && (
                <Select
                  placeholder="Select a Bank"
                  style={{ width: '100%' }}
                  value={selectedChappaBank ? selectedChappaBank : null}
                  onChange={(value) => setSelectedChappaBank(value)}
                >
                  {supportedChappaBanks.map((bank, index) => {
                    return (
                      <Select.Option key={index} value={bank.code}>
                        {bank.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              )}
              <div className="flex  w-full flex-col gap-1">
                <p className="m-0 p-0">{t('Amount')}</p>
                <InputNumber
                  value={amountWD}
                  style={{
                    width: '100%',
                    marginBottom: 10,
                    // color:
                    // amountWD > MAX_AMOUNT || amountWD < MIN_AMOUNT
                    //   ? 'red'
                    //   : '',
                  }}
                  name="amountWD"
                  onChange={(value) => {
                    setAmountWD(value);
                  }}
                />
                {!configurations.useridentifier_withdraw_editable ||
                transferType == 'chappa' ? (
                  <>
                    <p className="m-0 p-0">
                      {
                        '* Account Name must match the name on your bank account'
                      }
                    </p>
                    <Input
                      style={{ width: '100%', marginBottom: 10 }}
                      value={accountName}
                      placeholder={t('AccountName')}
                      required={true}
                      name="accountName"
                      onChange={(e) => setAccountName(e.target.value)}
                    />
                  </>
                ) : (
                  ''
                )}
                {transferType == 'chappa' ? (
                  <>
                    <p className="m-0 p-0">{t('AccountNumber')}</p>
                    <Input
                      style={{ width: '100%', marginBottom: 10 }}
                      value={
                        !configurations.useridentifier_withdraw_editable ||
                        configurations.is_mobile_meny
                          ? userDetail.username
                          : accountNumber
                      }
                      placeholder={t('AccountNumber')}
                      required={true}
                      disabled={
                        !configurations.useridentifier_withdraw_editable ||
                        configurations.is_mobile_meny
                      }
                      name="accountNumber"
                      onChange={(e) => {
                        if (
                          !configurations.useridentifier_withdraw_editable ||
                          configurations.is_mobile_meny
                        )
                          return;
                        setAccountNumber(e.target.value);
                      }}
                    />
                  </>
                ) : (
                  ''
                )}
              </div>
              {transferType == 'ebirr' ||
              transferType == 'telebirr' ||
              supportedSantimWithdrawBanks?.some(
                (item) => item.code === transferType
              ) ||
              transferType == 'amole' ? (
                <Input
                  value={reciverPhone}
                  disabled={!configurations.useridentifier_withdraw_editable}
                  style={{ width: '100%', marginBottom: 10 }}
                  placeholder={t('Phone')}
                  name="reciverPhone"
                  onChange={(e) => setReciverPhone(e.target.value)}
                />
              ) : (
                ''
              )}
            </div>
            <p className="text-red-500/80">
              {t('TransactionFeeWillBeApplied')}
            </p>
            <div className="flex flex-col items-start justify-center gap-y-2 gap-x-4 ">
              <button
                className="flex h-8 w-28 items-center justify-center gap-x-1 rounded bg-secondary-500  px-1 py-2 text-center font-semibold uppercase text-font-dark"
                disabled={loadingTransfer}
                onClick={reqWithdrow}
              >
                {loadingTransfer && (
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className=" mr-2 h-4 w-4 animate-spin fill-font-dark text-active "
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                )}
                {t('Withdraw')}
              </button>
            </div>
            {/* {transferType == 'chappa' && (
              <ol className="list-decimal pl-4">
                <li>
                  <div>
                    <span> {'Our Transfer hours are '} </span>{' '}
                    <span className="text-success">
                      {'Monday - Saturday from 08:30 AM - 04:30 PM only.'}{' '}
                    </span>
                  </div>
                </li>
                <li>
                  <div>
                    <span> {'Minimum withdrawal = '} </span>{' '}
                    <span className="text-success">
                      {`${MIN_AMOUNT} ${configurations.currency} `}{' '}
                    </span>
                  </div>
                </li>
                <li>
                  <div>
                    <span> {'Withdrawal process time = '} </span>{' '}
                    <span className="text-success">{'30 minutes'} </span>
                  </div>
                </li>
              </ol>
            )} */}
          </div>
        </div>
      </Modal>

      <Modal
        visible={branchWithdrawVisible}
        onCancel={() => setBranchWithdrawVisible(false)}
        onOk={() => setBranchWithdrawVisible(false)}
      >
        <div className="max-w-lg">
          <div className="flex h-20 w-full items-center justify-start bg-header-container px-4">
            <img src={logo} className="h-12" />
          </div>
          <div className="flex w-full items-center justify-between gap-2 px-4 py-2">
            <h2 className="m-0 p-0 text-lg uppercase">
              {t('Branch')} {t('Withdraw')}
            </h2>
            <FaLandmark className="text-xl" />
          </div>
          <div className="flex w-full flex-col flex-wrap justify-center gap-y-4 px-4 pb-4 md:w-80">
            {renderBranchWithdraw()}
          </div>
        </div>
      </Modal>

      <Modal
        visible={showCBEBirrOTP}
        onCancel={() => setShowCBEBirrOTP(false)}
        onOk={() => setShowCBEBirrOTP(false)}
      >
        <div className="max-w-lg">
          <div className="flex h-20 w-full items-center justify-start bg-header-container px-4">
            <img src={logo} className="h-12" />
          </div>
          <div className="flex flex-col gap-2">
            <br />
            <center>
              <h3 className="text-lg">{'Task Successful'}</h3>
            </center>
            <span>{t('YourdepositRequestInitializedPleaseApprove')}</span>
            <h2 className="text-lg">{billReferenceNumber}</h2>
            <div>
              <hr />
              <div>
                <h5 className="">{'USSD Dialer'}</h5>
              </div>
              <div>
                <ol>
                  <li>
                    {Parser(
                      t('DialCodeMSG').replace(
                        '*847#',
                        () => `<strong>*847# </strong>`
                      )
                    )}
                  </li>
                  <li>
                    {Parser(
                      t('ChooseNumberForPayBill').replace(
                        'Pay Bill',
                        () => `<strong>Pay Bill</strong>`
                      )
                    )}
                  </li>
                  <li>
                    {Parser(
                      t('EnterShortCode').replace(
                        '949596',
                        () => `<strong>949596</strong>`
                      )
                    )}
                  </li>
                  <li>
                    {Parser(
                      t('Choose2forInputShortCode').replace(
                        '2',
                        () => `<strong>2</strong>`
                      )
                    )}
                  </li>
                  <li>
                    {Parser(
                      t(
                        'WhenAskedForBillReferenceNoEnterTheReferenceNumber'
                      ).replace(
                        'RefNum',
                        () => `<strong>${billReferenceNumber}</strong>`
                      )
                    )}
                  </li>
                  <li>
                    {Parser(
                      t('WhenAskedToConfirmThePaymentReply1').replace(
                        '1',
                        () => `<strong>1</strong>`
                      )
                    )}
                  </li>
                  <li>{t('EnterYourCBE_BirrPIN_NumberToFinishThePayment')}</li>
                </ol>
              </div>
              <div style={{ width: 100, marginLeft: 24 }}>
                <a href={`tel:${API.HULU_USSD_CODE}`}>
                  <div
                    className=" flex h-[35px] w-[100px] cursor-pointer items-center justify-between rounded-md bg-primary-700 px-1.5"
                    // style={{
                    //   display: 'flex',
                    //   alignItems: 'center',
                    //   justifyContent: 'space-between',
                    //   cursor: 'pointer',
                    //   background: '#4CAF50',
                    //   color: 'font-light',
                    //   width: 100,
                    //   height: 35,
                    //   margenLeft: 21,
                    //   paddingLeft: 5,
                    //   paddingRight: 5,
                    //   borderRadius: 5,
                    // }}
                  >
                    <b>Dial</b>
                    <AiFillPhone className="mt-2 mb-2.5 text-right  text-sm " />
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        // title={t('WithdrawMoney')}
        visible={showCode}
        onOk={() => setShowCode(!showCode)}
        onCancel={() => setShowCode(!showCode)}
      >
        <div className="max-w-lg">
          <div className="flex h-20 w-full items-center justify-start bg-header-container px-4">
            <img src={logo} className="h-12" />
          </div>
          <div className="flex flex-col gap-2">
            <br />
            <div className="px-4">
              <h2 className="text-lg uppercase">{t('WithdrawMoney')}</h2>
            </div>
            <div className="withdrawMoney px-4 py-2">
              <div
                className="flex justify-between "
                style={{ marginBottom: 10 }}
              >
                <div style={{ fontWeight: 600 }}>{t('WithdrawDetails')}</div>
                <div style={{ color: 'gray' }}></div>
              </div>
              <div className="flex justify-between ">
                <div>{t('Withdraw') + ' ' + t('Amount')}</div>
                <div style={{ fontWeight: 500 }}>
                  {withdrowAmmount} {t(configurations?.currency)}
                </div>
              </div>
              <div className="flex justify-between ">
                <div>{t('Transaction') + ' ' + t('Fee')}</div>
                <div style={{ fontWeight: 500 }}>
                  {transactionFee} {t(configurations?.currency)}
                </div>
              </div>
              <div className="flex justify-between ">
                <div>{t('NetPay')}</div>
                <div style={{ fontWeight: 500 }}>
                  {netPay} {t(configurations?.currency)}
                </div>
              </div>
              <Divider style={{ marginTop: 15, marginBottom: 15 }} />
              {i18n.resolvedLanguage == 'Am' ? (
                <div>የመውጫ ቁጥሮ በኣጭር መልእክት ተልኮሎታል።</div>
              ) : (
                <div>Your withdraw code is sent to you via SMS.</div>
              )}
              {i18n.resolvedLanguage == 'En' ? (
                <div>
                  Please go to a nearby {configurations.name} Betting shop and
                  withdraw the money using the withdraw code.
                  <br />
                  Make sure not to share the withdraw code with anyone.
                </div>
              ) : (
                <div>
                  እባኮ በኣቅራቢያዎ ወዳለ {configurations.name} ሱቅ በመሄድ የወጪ ኣጭር ቁጥሩን
                  በመጠቀም ገንዘቦን ይውሰዱ።
                  <br />
                  የወጪ ማረጊያ ቁጥሩ ለሌላ ሰው ኣለማጋራቶን አርግጠኛ ይሁኑ።
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
