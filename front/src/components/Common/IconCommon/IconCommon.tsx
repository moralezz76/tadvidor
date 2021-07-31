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
} from 'react-icons/bs';
import { RiHeartFill, RiHeartAddLine, RiHeartLine } from 'react-icons/ri';
import { VscGraph } from 'react-icons/vsc';
import { BiBuildings } from 'react-icons/bi';
import { AiOutlineGlobal, AiFillSafetyCertificate, AiOutlineShoppingCart } from 'react-icons/ai';
import { FaAngleDoubleRight, FaXRay } from 'react-icons/fa';
import { RiShieldCheckFill, RiShieldCheckLine } from 'react-icons/ri';
import { HiOutlineShoppingCart } from 'react-icons/hi';
import { MdAddShoppingCart } from 'react-icons/md';
import { GrGroup } from 'react-icons/gr';

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
    backbone: <FaXRay {...FaXRay} />,
  };

  return refs[type] || null;
};

export default IconCommon;
