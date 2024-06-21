import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function SearchById({ onClose }) {
  const [ticketNumber, setTicketNumber] = useState();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="z-10 my-2 flex h-9 items-center justify-end bg-secondary-button ">
      <input
        type="text"
        name="ticket_number"
        id="ticket_number"
        placeholder={`${t('Match')} ${t('Id').toLocaleLowerCase()} ...`}
        className="h-full w-full  bg-nav-search-input px-3 text-nav-search-input-font  outline-none"
        onChange={(e) => setTicketNumber(e.target.value.trim())}
      />

      <button
        className=" flex h-9 w-fit cursor-pointer items-center justify-center gap-x-1 rounded bg-secondary-button px-2 text-xs capitalize text-secondary-button-font"
        disabled={!ticketNumber}
        onClick={() => {
          navigate(`/match/detail/${ticketNumber}`);
          if (typeof onClose == 'function') onClose();
        }}
      >
        {t('search')}
      </button>
    </div>
  );
}
