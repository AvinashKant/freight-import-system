import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import ImportModal from "../components/ImportModal";
import Icon from '../../../assets/images/Vector.svg';
import { getAllFreight } from "../services/dashboardServices";
import { FormatDate } from "../../../utils/dateFormat";

const tableHeaders = [
    { id: 'shipment_id', label: 'shipmentId' },
    { id: 'origin_country', label: 'OriginCountry' },
    { id: 'destination_country', label: 'DestinationCountry' },
    { id: 'container_type', label: 'ContainerType' },
    { id: 'carrier', label: 'Carrier' },
    { id: 'freight_rate', label: 'FreightRate' },
    { id: 'date_time', label: 'dateTime' },
];

const Dashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [freights, setFreights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchFreights = async () => {
            try {
                const response = await getAllFreight();
                setFreights(response.data);
            } catch (err) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchFreights();
    }, [isModalOpen]);

    return (
        <DashboardLayout>
            <div>
                {/* Header Section */}
                <div className="flex justify-between items-start mb-4">
                    <h1 className="text-2xl font-normal">Quotes</h1>
                    <button
                        className="flex items-center gap-2 px-4 py-2 bg-[#f5f5f5] border border-[#B3B3B3] rounded-lg hover:bg-gray-50 shadow-sm"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Import file
                    </button>
                </div>

                {/* Table Section */}
                <div className="overflow-auto bg-gray-50 rounded-xl shadow">
                    <table className="min-w-full text-left">
                        <thead className="bg-white text-gray-700">
                            <tr>
                                {tableHeaders.map((header, index) => (
                                    <th
                                        key={header.id}
                                        className={`p-2 ${index !== tableHeaders.length - 1 ? 'border-r-2 border-[#D9D9D9]' : ''}`}
                                    >
                                        <div className="flex justify-between items-center w-full">
                                            <span>{header.label}</span>
                                            <img src={Icon} alt="sort icon" className="w-4 h-4" />
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-[#D9D9D9]">
                            {loading ? (
                                <tr>
                                    <td colSpan={tableHeaders.length} className="text-center py-3 bg-[#f0f0f0]">
                                        Loading...
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={tableHeaders.length} className="text-center py-3 text-red-500 bg-[#ffe5e5]">
                                        Error: {error}
                                    </td>
                                </tr>
                            ) : freights.length === 0 ? (
                                <tr>
                                    <td colSpan={tableHeaders.length} className="text-center py-3 text-gray-500 bg-[#edede9]">
                                        No data has been added!
                                    </td>
                                </tr>
                            ) : (
                                freights.map((freight, index) => (
                                    <tr key={index} className="bg-[#eaeae8]">
                                        <td className="px-4 py-2 border-r-2 border-[#D9D9D9]">{freight.id}</td>
                                        <td className="px-4 py-2 border-r-2 border-[#D9D9D9]">{freight.origin_country}</td>
                                        <td className="px-4 py-2 border-r-2 border-[#D9D9D9]">{freight.destination_country}</td>
                                        <td className="px-4 py-2 border-r-2 border-[#D9D9D9]">{freight.container_type}</td>
                                        <td className="px-4 py-2 border-r-2 border-[#D9D9D9]">{freight.carrier}</td>
                                        <td className="px-4 py-2 border-r-2 border-[#D9D9D9]">{freight.freight_rate}</td>
                                        <td className="px-4 py-2 border-r-2 border-[#D9D9D9]">{FormatDate(freight.created_at)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <ImportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                )}
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
