import React from 'react';

import {
  BsTrash,
  BsBookmarkFill,
  BsBookmark,
  BsCaretRightFill,
  BsStarFill,
  BsStar,
  BsSearch,
  BsCaretUpFill,
  BsCaretDownFill,
} from 'react-icons/bs';
import { RiHeartFill, RiHeartAddLine, RiHeartLine } from 'react-icons/ri';
import { VscGraph, VscGlobe } from 'react-icons/vsc';
import { BiBuildings } from 'react-icons/bi';
import { IoMdGlobe } from 'react-icons/io';
import { AiOutlineGlobal, AiFillSafetyCertificate } from 'react-icons/ai';
import { FaAngleDoubleRight } from 'react-icons/fa';
import { RiShieldCheckFill, RiShieldCheckLine } from 'react-icons/ri';

import './IconCommon.scss';

const IconCommon = (props: any) => {
  const { type = '', ...rest } = props;

  const refs: any = {
    trash: <BsTrash {...rest} />,
    fav: <RiHeartFill {...rest} />,
    heartA: <RiHeartAddLine {...rest} />,
    heartL: <RiHeartLine {...rest} />,
    bookmark: <BsBookmarkFill {...rest} />,
    bookmarkL: <BsBookmark {...rest} />,
    caret: <BsCaretRightFill {...rest} />,
    starL: <BsStar {...rest} />,
    star: <BsStarFill {...rest} />,
    graph: <VscGraph {...rest} />,
    search: <BsSearch {...rest} />,
    provider: <BiBuildings {...rest} />,
    global: <AiOutlineGlobal {...rest} />,
    safe: <AiFillSafetyCertificate {...rest} />,
    hideR: <FaAngleDoubleRight {...rest} />,
    arrowup: <BsCaretUpFill {...rest} />,
    arrowdown: <BsCaretDownFill {...rest} />,
    shield: <RiShieldCheckFill {...rest} />,
    shieldL: <RiShieldCheckLine {...rest} />,
  };

  return refs[type] || null;
};

export default IconCommon;
