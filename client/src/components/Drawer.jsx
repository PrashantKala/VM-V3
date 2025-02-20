import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

const Drawer = ({ selectedServiceInfo, selectedAsset }) => {
    return (
        <div style={{position:"relative",overflowY:"auto"}}>
            <Swiper navigation={false} pagination={{
                    clickable: true,
                    el: '.custom-pagination', 
                }} modules={[Navigation, Pagination]}>
                <SwiperSlide >
                    <div className="drawer-content">
                        <h2>{selectedAsset.name}</h2>
                        <img style={(window.innerWidth<768 && selectedAsset.name.startsWith('Submarine'))?{width:'80px'}:(selectedAsset.name.startsWith('Submarine'))?{width:'120px'}:{}} src={selectedAsset.icon} alt={selectedAsset.name} className="drawer-asset-icon" />
                        <table>
                            <tbody>
                                {Object.entries(selectedAsset.properties).map(([key, value]) => (
                                    <tr key={key}>
                                        <th>{key}</th>
                                        <td>{value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </SwiperSlide>

                {(window.innerWidth < 768) ? selectedAsset.servicesInfo.map((info, index) => (
                    <SwiperSlide key={index}>
                        <div className="drawer-content-services-info">
                            <h2>{info.name}</h2>
                            {Object.entries(info.properties).map(([key, value]) => (
                                <table key={key}>
                                    <tbody>
                                        <tr>
                                            <th>{key}</th>
                                            <td>{value}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            ))}
                        </div>
                    </SwiperSlide>
                )) : selectedServiceInfo &&
                selectedAsset.servicesInfo
                    .filter(info => info.name === selectedServiceInfo)
                    .map((info, index) => (
                        <>
                        <hr/>
                        <div style={{}} key={index} className="drawer-content-services-info">
                            <h2>{info.name}</h2>
                            {Object.entries(info.properties).map(([key, value]) => (
                                <table key={key}>
                                    <tbody>
                                        <tr>
                                            <th>{key}</th>
                                            <td>{value}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            ))}
                        </div>
                        </>
                    ))

                }
                <div className="custom-pagination" style={{}}></div>


            </Swiper>
        </div>
    )
}

export default Drawer







