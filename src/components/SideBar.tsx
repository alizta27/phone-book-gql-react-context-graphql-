import SideBarItem from './SideBarItem';
import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Detail from '../Pages/Detail';
import {
  Wrapper,
  SideBarWrapper,
  SideBarWrapperMobile,
  SideBarItemWrapper,
  SideBarItemWrapperMobile,
  DetailWrapper,
  InnerWrapper,
} from '../assets/styles';
import { MyContext, AppContextInterface } from '../constant';
import { CONTACT_LIST } from '../config/queries';
import { useQuery } from '@apollo/client';

type HeightProps = {
  heightpx: number | string;
};
const InnerWrapperMobile = styled.div<HeightProps>((props) => ({
  display: 'flex',
  borderRadius: '20px',
  flexDirection: 'column',
  width: '100%',
  padding: '3%',
  height: props.heightpx + 'px',
  maxHeight: '3',
  backgroundColor: '#ffffff',
  margin: '1%',
  boxShadow: '-3px 0px 18px -6px rgba(130, 130, 130, 0.39)',
}));
interface LayoutProps {
  children: React.ReactNode;
}

const SideBar: React.FC<LayoutProps> = ({ children }) => {
  const [isDetail, setIsDetail] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [heightpx, setHeightpx] = useState<string | number>(window.innerWidth);
  const [contact, setContact] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [bucket, setBucket] = useState<any[]>([]);
  const [favourite, setFavourite] = useState<any[]>([]);
  const [totalFav, setTotalFav] = useState<number>(0);
  const [id, setId] = useState<number | string>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const { loading, error, data, refetch } = useQuery(CONTACT_LIST, {
    variables: {
      where: {
        first_name: { _like: '%%' },
      },
    },
  });

  useEffect(() => {
    const contact: any[] = [];
    let favourite: any[] = [];

    let fav = localStorage.getItem('favourite');
    if (fav) {
      favourite = JSON.parse(fav);
    }
    if (data) {
      if (favourite.length) {
        let newContact: any[] = [...favourite, ...data.contact];
        for (const elx of newContact) {
          let num = 0;
          for (const ely of newContact) {
            const x = elx.id.toString();
            const y = ely.id.toString();
            if (x === y) {
              num += 1;
            }
          }
          if (num === 1) {
            contact.push(elx);
          }
        }
        localStorage.setItem('contact', JSON.stringify(contact));
      } else {
        localStorage.setItem('contact', JSON.stringify(data.contact));
      }
    }
    const dataContact = localStorage.getItem('contact');
    if (dataContact) {
      const contact = JSON.parse(dataContact);
      setContact(contact);
    }
    setTotal(contact?.length ? contact?.length : data?.contact?.length);
    setTotalFav(favourite.length);
  }, [data, refetch, favourite]);

  useEffect(() => {
    let fav = localStorage.getItem('favourite');
    if (fav) {
      setFavourite(JSON.parse(fav));
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const handleResizeWindow = () => setWidth(window.innerWidth);
    setHeightpx(window.innerHeight - 180);
    window.addEventListener('resize', handleResizeWindow);
    return () => {
      window.removeEventListener('resize', handleResizeWindow);
    };
  });

  useEffect(() => {
    refetch({
      where: {
        first_name: { _like: `%${search}%` },
      },
    });
  }, [search, refetch, favourite]);

  useEffect(() => {
    if (width <= 540) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, [width]);

  const contextValue: AppContextInterface = {
    isDetail,
    setIsDetail,
    loading,
    error,
    contact,
    refetch,
    setContact,
    search,
    setSearch,
    total,
    totalFav,
    bucket,
    id,
    setId,
    setBucket,
    favourite,
    setFavourite,
  };

  if (isMobile) {
    return (
      <MyContext.Provider value={contextValue}>
        <SideBarWrapperMobile>
          <SideBarItemWrapperMobile>
            <SideBarItem isMobile={isMobile} />
          </SideBarItemWrapperMobile>
          <Wrapper>
            <InnerWrapperMobile heightpx={heightpx}>
              {children}
            </InnerWrapperMobile>
          </Wrapper>
          {isDetail && (
            <DetailWrapper>
              <Detail />
            </DetailWrapper>
          )}
        </SideBarWrapperMobile>
      </MyContext.Provider>
    );
  } else {
    return (
      <MyContext.Provider value={contextValue}>
        <SideBarWrapper>
          <SideBarItemWrapper>
            <SideBarItem isMobile={isMobile} />
          </SideBarItemWrapper>
          <Wrapper>
            <InnerWrapper>{children}</InnerWrapper>
          </Wrapper>
          {isDetail && (
            <DetailWrapper>
              <Detail />
            </DetailWrapper>
          )}
        </SideBarWrapper>
      </MyContext.Provider>
    );
  }
};

export default SideBar;
