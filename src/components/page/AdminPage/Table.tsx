import { Spin } from 'antd';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hooks';
import { deleteAdUser } from '../../../network/ads';

import { getAdsSuccess } from '../../../store/adsSlice/adsSlice';
import Modal from '../../common/Modal/Modal';
import style from './AdminPage.module.scss';

type TablePropsType = {
  setDeleteIdAd: React.Dispatch<React.SetStateAction<string>>;
};

const Table = ({ setDeleteIdAd }: TablePropsType) => {
  const { filterAds, isLoading } = useAppSelector((state) => state.ads);
  const [dataTable, setDataTable] = useState(filterAds);
  const [modalDelete, setmodalDelete] = useState(false);
  const [directionSort, setDirectionSort] = useState(false);
  const [modalOpenAd, setModalOpenAd] = useState(false);
  const navigate = useNavigate();
  const getDate = (data: string) => data.split('T')[0].split('-').reverse().join(' - ');

  const sortIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.4">
        <path d="M12 7L16 11H8L12 7Z" fill="#2C2D2E" />
        <path d="M12 17L8 13L16 13L12 17Z" fill="#2C2D2E" />
      </g>
    </svg>
  );

  useLayoutEffect(() => {
    setDataTable(filterAds);
  }, [filterAds]);

  const openAd = (published: string, id: string) => {
    if (published === 'Нет') {
      setModalOpenAd(true);
    } else {
      navigate(`/product/${id}`);
    }
  };

  const sortName = () => {
    const adsData = [...filterAds];
    if (directionSort === false) {
      setDataTable(
        adsData.sort((a, b) => {
          if (a.title < b.title) {
            return -1;
          }
          if (a.title > b.title) {
            return 1;
          }

          return 0;
        })
      );
      setDirectionSort(true);
    }
    if (directionSort === true) {
      setDataTable(
        adsData.sort((a, b) => {
          if (a.title > b.title) {
            return -1;
          }
          if (a.title < b.title) {
            return 1;
          }

          return 0;
        })
      );
      setDirectionSort(false);
    }
  };

  return (
    <div className={style.table}>
      <div className={`${style.table_row} ${style.table_row_top}`}>
        <div className={style.table_name}>
          Название объявления
          <Link to="#!" onClick={sortName}>
            {sortIcon}
          </Link>
        </div>
        <div className={style.table_category}>Категория</div>
        <div className={style.table_date}>Дата публикации</div>
        <div className={style.table_publication}>Публикация</div>
      </div>
      {isLoading ? (
        <Spin size="large" />
      ) : (
        dataTable.map((el) => (
          <div key={el.id} className={`${style.table_row} ${style.table_row_main}`}>
            <h2 className={style.table_name_item}>{el.title}</h2>
            <span className={style.table_date_item}>{el.category}</span>
            <span className={style.table_publication_item}>{getDate(el.createdAt)}</span>
            <div className={style.table_publication_item}>
              <span>{el.published}</span>
              <div className={style.table_action}>
                <Link to="#!" className={style.table_action_svg}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <g opacity="0.4">
                      <path
                        d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
                        stroke="#2C2D2E"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z"
                        stroke="#2C2D2E"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z"
                        stroke="#2C2D2E"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </svg>
                </Link>
                <ul className={style.table_action_menu}>
                  <li>
                    <button
                      className={style.link_back}
                      onClick={() => openAd(el.published, el.id)}
                      type="button">
                      Просмотреть
                    </button>
                    {modalOpenAd && (
                      <Modal
                        textAlert="Объявление будет доступно после модерации."
                        inform
                        handleClickNo={() => {
                          setModalOpenAd(false);
                        }}
                      />
                    )}
                  </li>
                  <li>
                    <button
                      className={style.link_back}
                      type="button"
                      onClick={() => {
                        navigate(`/editproduct/${el.id}`);
                      }}>
                      Редактировать
                    </button>
                  </li>
                  <li>
                    {modalDelete && (
                      <Modal
                        textAlert="Точно удалить?"
                        inform={false}
                        textOk="ДА"
                        textNo="Нет"
                        handleClickOk={() => {
                          setDeleteIdAd(el.id);
                        }}
                        handleClickNo={() => {
                          setmodalDelete(false);
                        }}
                      />
                    )}
                    <button
                      className={style.link_back}
                      type="button"
                      onClick={() => {
                        setmodalDelete(true);
                      }}>
                      Удалить
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Table;
