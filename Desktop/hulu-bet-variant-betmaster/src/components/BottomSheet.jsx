import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  transform,
} from 'framer-motion';
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import partner3 from '@assets/img/partners/lion.png';
import wegagen from '@assets/img/partners/wegagen.png';
import amole from '@assets/img/partners/amole.png';
import ebirr from '@assets/img/partners/ebirr.png';
import cbe from '@assets/img/partners/cbebirr.png';
import teleBirr from '@assets/img/partners/telebirr.jpg';

import MobileDeposit from './MobileDeposit';
import { useWallet } from '@hooks/useWallet';
import { BsCheck } from 'react-icons/bs';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';

// import { Input, InputNumber, Select } from 'antd';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const fast = { type: 'spring', stiffness: 2000, damping: 120 };
function BottomSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const opacity = useMotionValue();
  const panel = useRef();

  const [supportedPaymentMethods, setSupportedPaymentMethods] = useState({});
  const [transferType, setTransferType] = useState(null);
  const [amountHC, setAmountHC] = useState(null);
  const [reciverPhone, setReciverPhone] = useState(null);

  const configurations = useSelector(
    (state) => state.configuration.configurations
  );

  const {
    getTransaction,
    requestWithdrow,
    amoleConfirm,
    transfer,
    withdrowHellocash,
    depositHellocash,
    cbeConfirm,
  } = useWallet();

  const walletRef = useRef(null);
  const { t } = useTranslation();

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
        }
      }
    });
    setSupportedPaymentMethods(supported_payment_methods);
  }, []);

  useEffect(() => {
    const themeTag = document.querySelector('meta[name=theme-color]');
    return opacity.onChange((v) => {
      const color = transform(v, [0, 1], ['#fff', '#a6a6a6']);
      themeTag.setAttribute('content', color);
    });
  }, [opacity]);

  const changeBankType = (type) => {
    // console.log(type);
    setTransferType(type);
  };

  const handleUpdate = (latest) => {
    if (typeof latest.y === 'string') return;
    const { height } = panel.current.getBoundingClientRect();
    const progress = transform(latest.y, [0, height], [1, 0]);
    opacity.set(progress);
  };

  const handleDragEnd = (_, info) => {
    const { velocity, offset } = info;
    const { height } = panel.current.getBoundingClientRect();
    const shouldClose = velocity.y > 20 || offset.y > height / 2;
    if (shouldClose) setIsOpen(false);
  };

  //   useEffect(() => {
  //     const themeTag = document.querySelector('meta[name=theme-color]');
  //     return opacity.onChange((v) => {
  //       const color = transform(v, [0, 1], ['#fff', '#a6a6a6']);
  //       themeTag.setAttribute('content', color);
  //     });
  //   }, [opacity]);

  return (
    <Dialog.Root
      className="relative z-50"
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <Dialog.Trigger className="flex h-7 w-fit cursor-pointer items-center justify-center gap-x-2 rounded-md bg-active px-2 text-xs  text-active-font shadow-lg">
        <span className="font-mono">{t(`Deposite`)}</span>
      </Dialog.Trigger>
      <Dialog.Portal forceMount>
        <AnimatePresence>
          {isOpen && (
            <>
              <Dialog.Overlay asChild forceMount>
                <motion.div
                  className="fixed inset-0 z-50 bg-black/70"
                  style={{ opacity }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  ref={panel}
                  className=" fixed bottom-0 left-1/2 z-50 flex w-full max-w-[450px] flex-col gap-8 overflow-hidden rounded-t-3xl bg-white shadow-lg    "
                  transition={fast}
                  style={{ x: '-50%' }}
                  initial={{ y: '150%' }}
                  animate={{ y: 0, dur: 0.3 }}
                  exit={{ y: '120%' }}
                  onDragEnd={handleDragEnd}
                  onUpdate={handleUpdate}
                  dragElastic={0.05}
                  dragConstraints={{ top: 0 }}
                  drag="y"
                >
                  <div className="relative z-50 ">
                    <MobileDeposit />
                  </div>
                </motion.div>
              </Dialog.Content>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default BottomSheet;
