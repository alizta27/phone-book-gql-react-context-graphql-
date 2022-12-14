import {
  ImgContact,
  ContactName,
  ContactNumber,
  TableList,
  PhotoWrapper,
  WrapFavDel,
  WrapTableItem,
  ListWrapItem,
  ItemInfo,
  EmptyData,
} from '../assets/styles';
import { Contact } from '../assets/types';
import BarLoader from 'react-spinners/BarLoader';
import React, { useContext, CSSProperties } from 'react';
import { toast } from 'react-toastify';
import { MyContext } from '../constant';
import { MdDeleteForever, MdFavoriteBorder, MdWorkOff } from 'react-icons/md';

interface Props {
  error?: any;
  loading?: boolean;
  contact?: Contact[];
  limit: number;
  skip: number;
  openModal: any;
  favourites?: Contact[];
}

const override: CSSProperties = {
  display: 'block',
  margin: '0 auto',
  borderColor: '#90ECA4',
  marginTop: '100px',
};

const ListContact: React.FC<Props> = ({
  error,
  openModal,
  loading,
  contact,
  limit,
  skip,
}) => {
  const Ctx = useContext(MyContext);

  const handleDetail = (id: any) => {
    Ctx?.setId(id);
    Ctx?.setIsDetail(true);
  };

  const handleFavourite = (id: number | string) => {
    let favourites: any[] = [];
    const fav = localStorage.getItem('favourite');
    if (fav) {
      favourites = JSON.parse(fav);
    }
    const arr: any[] = [...favourites];
    if (contact) {
      for (const elx of contact) {
        if (elx.id === id) {
          arr.push(elx);
        }
      }
    }
    localStorage.setItem('favourite', JSON.stringify(arr));
    Ctx?.setFavourite(arr);
    toast.success('Success Add Fafourite Contact', { autoClose: 2000 });
  };

  if (error) {
    return (
      <TableList>
        <EmptyData>
          <p>Oopss.. Something error</p>
        </EmptyData>
      </TableList>
    );
  } else if (loading) {
    return (
      <BarLoader
        color="#36d7b7"
        height={9}
        width={170}
        cssOverride={override}
      />
    );
  } else if (contact) {
    contact = contact.sort((a: any, b: any) => {
      if (a.first_name.toLowerCase() < b.first_name.toLowerCase()) {
        return -1;
      }
      if (a.first_name.toLowerCase() > b.first_name.toLowerCase()) {
        return 1;
      }
      return 0;
    });
    contact = contact.slice(skip, limit);

    if (contact.length) {
      return (
        <TableList>
          {contact &&
            contact?.map((item: any, idx) => {
              return (
                <ListWrapItem key={idx}>
                  <ItemInfo>
                    <PhotoWrapper
                      onClick={() => {
                        handleDetail(item.id);
                      }}
                    >
                      <ImgContact
                        src="https://media.istockphoto.com/vectors/default-avatar-photo-placeholder-icon-grey-profile-picture-business-vector-id1327592449?k=20&m=1327592449&s=612x612&w=0&h=6yFQPGaxmMLgoEKibnVSRIEnnBgelAeIAf8FqpLBNww="
                        alt="contact"
                      />
                    </PhotoWrapper>
                    <WrapTableItem
                      onClick={() => {
                        handleDetail(item.id);
                      }}
                    >
                      <ContactName>{`${item?.first_name} ${item?.last_name}`}</ContactName>
                      <ContactNumber>{item?.phones[0]?.number}</ContactNumber>
                    </WrapTableItem>
                  </ItemInfo>
                  <WrapFavDel>
                    <MdDeleteForever
                      color="#FA7383"
                      size={25}
                      onClick={() => openModal(item?.id)}
                    />
                    <MdFavoriteBorder
                      color="#90ECA4"
                      size={25}
                      onClick={() => handleFavourite(item?.id)}
                    />
                  </WrapFavDel>
                </ListWrapItem>
              );
            })}
        </TableList>
      );
    } else {
      return (
        <TableList>
          <EmptyData>
            <MdWorkOff color="#DEFFE5" size={200} />
          </EmptyData>
        </TableList>
      );
    }
  } else {
    return null;
  }
};

export default ListContact;
