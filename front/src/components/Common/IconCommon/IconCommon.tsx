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
  BsList,
  BsEye,
  BsThreeDots,
} from 'react-icons/bs';
import { RiHeartFill, RiHeartAddLine, RiHeartLine } from 'react-icons/ri';
import { VscGraph } from 'react-icons/vsc';
import { BiBuildings } from 'react-icons/bi';
import { AiOutlineGlobal, AiFillSafetyCertificate } from 'react-icons/ai';
import { FaAngleDoubleRight, FaXRay } from 'react-icons/fa';
import { RiShieldCheckFill, RiShieldCheckLine } from 'react-icons/ri';
import { HiOutlineShoppingCart } from 'react-icons/hi';
import { MdAddShoppingCart } from 'react-icons/md';
import { GrGroup } from 'react-icons/gr';
import { FiPlusSquare, FiMinusSquare } from 'react-icons/fi';
import { IoMdRadioButtonOn, IoMdRadioButtonOff } from 'react-icons/io';

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
    list: <BsList {...rest} />,
    retail: <HiOutlineShoppingCart {...rest} />,
    wholesale: <MdAddShoppingCart {...rest} />,
    customer_growth: <GrGroup {...rest} />,
    peering_base: <BsEye {...rest} />,
    backbone: <FaXRay {...rest} />,
    plus: <FiPlusSquare {...rest} />,
    minus: <FiMinusSquare {...rest} />,
    radio: <IoMdRadioButtonOn {...rest} />,
    radioE: <IoMdRadioButtonOff {...rest} />,
    dots: <BsThreeDots {...rest} />,
  };

  return refs[type] || null;
};

export default IconCommon;
