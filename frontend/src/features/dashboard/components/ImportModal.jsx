import React, { useRef, useState, useEffect } from "react";
import ModalBox from "../../../components/Layout/ModalBox";
import * as XLSX from "xlsx";
import Icon from '../../../assets/images/Vector.svg';
import { showErrorToast, showSuccessToast } from "../../../utils/toastUtils";
import { saveFreight } from "../services/dashboardServices";

const ImportModal = ({ isOpen, onClose }) => {
    const [fileName, setFileName] = useState(null);
    const [rawData, setRawData] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [tableHeaders, setTableHeaders] = useState([
        { id: 'origin_country', label: 'OriginCountry' },
        { id: 'destination_country', label: 'DestinationCountry' },
        { id: 'container_type', label: 'ContainerType' },
        { id: 'carrier', label: 'Carrier' },
        { id: 'freight_rate', label: 'FreightRate' },
    ]);

    const inputRef = useRef(null);

    useEffect(() => {
        if (!isProcessing) setProgress(0);
    }, [isProcessing]);

    const simulateProgress = (steps, callback) => {
        if (!steps.length) return callback();
        const [first, ...rest] = steps;
        setProgress(first);
        setTimeout(() => simulateProgress(rest, callback), 300);
    };

    const handleFileUpload = (file) => {
        setFileName(file.name);
        setIsProcessing(true);
        setProgress(10);

        const reader = new FileReader();

        reader.onload = (e) => {
            simulateProgress([30, 60], () => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: "array" });
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                    if (json.length > 0) {
                        setRawData(json);
                        showSuccessToast("File uploaded and parsed successfully.");
                        setProgress(100);
                    } else {
                        showErrorToast("No data found in the uploaded file.");
                        setProgress(100);
                    }
                } catch (error) {
                    showErrorToast("Error parsing the Excel file.");
                    setProgress(100);
                } finally {
                    setTimeout(() => setIsProcessing(false), 800);
                }
            });
        };

        reader.onerror = () => {
            setProgress(100);
            setIsProcessing(false);
            showErrorToast("Failed to read the uploaded file.");
        };

        reader.readAsArrayBuffer(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files.length > 0) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    };

    const handleBrowse = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    };

    const handleHeaderDrop = (e, colIndex) => {
        e.preventDefault();
        const draggedId = e.dataTransfer.getData("headerId");
        const draggedIndex = tableHeaders.findIndex(h => h.id === draggedId);
        if (draggedIndex === -1 || draggedIndex === colIndex) return;

        const newHeaders = [...tableHeaders];
        const temp = newHeaders[draggedIndex];
        newHeaders[draggedIndex] = newHeaders[colIndex];
        newHeaders[colIndex] = temp;

        setTableHeaders(newHeaders);
    };

    const handleFreight = async () => {
        const rows = rawData.slice(1);
        const mappedData = rows.map(row => {
            const mapped = {};
            tableHeaders.forEach((header, i) => {
                mapped[header.id] = row[i] ?? "";
            });
            return mapped;
        });

        await saveFreight(mappedData).then((result) => {
            showSuccessToast(result.message || "File uploaded successfully.");
            onClose();
        }).catch((err) => {
            showErrorToast(err?.response?.data?.message || "Error parsing the Excel file.");
        });

    };

    return (
        <ModalBox isOpen={isOpen} onClose={onClose} title="Upload Necessary Documents" widthClass={rawData.length ? 'mx-4' : 'max-w-4xl'}>
            {!rawData.length ? (
                <>
                    <div
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        className="bg-white border-2 border-dashed border-gray-400 p-6 m-4 rounded-lg text-center"
                    >
                        <div className="text-4xl text-blue-500 mb-2">📁</div>
                        <p className="font-medium">Click or drag file to this area to upload</p>
                        <p className="text-gray-500 mt-1 text-sm">
                            Upload permits and certificates in CSV or Excel format.
                        </p>
                        <button
                            className="px-4 py-2 text-sm font-semibold mt-4 bg-black text-white rounded-lg hover:bg-gray-900"
                            onClick={() => inputRef.current?.click()}
                        >
                            Browse File
                        </button>
                        <input
                            type="file"
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            ref={inputRef}
                            className="hidden"
                            onChange={handleBrowse}
                        />
                    </div>
                    <div className="px-4 mb-4">
                        <label className="block text-sm font-medium text-gray-700">Uploaded File</label>
                        <div className="bg-white text-sm rounded-lg p-3 mt-2">
                            {fileName || "No File Uploaded yet"}
                        </div>
                    </div>
                    {isProcessing && (
                        <div className="px-4 mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Processing File...</label>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-gray-600 h-3 rounded-full transition-all duration-300 ease-in-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <>
                    <div className="px-4 mb-4">
                        <label className="block text-sm font-medium text-gray-700">Uploaded File</label>
                        <div className="bg-white text-blue-700 rounded-lg p-3 mt-2">{fileName}</div>
                    </div>

                    <div className="max-h-[300px] overflow-y-auto bg-gray-50 rounded-xl shadow mx-4">
                        <table className="min-w-full text-left border border-gray-300">
                            <thead className="bg-white text-gray-700">
                                <tr>
                                    {tableHeaders.map((header, colIndex) => (
                                        <th
                                            key={header.id}
                                            className={`p-2 ${colIndex !== tableHeaders.length - 1 ? 'border-r-2 border-[#D9D9D9]' : ''}`}
                                            draggable
                                            onDragStart={(e) => e.dataTransfer.setData("headerId", header.id)}
                                            onDrop={(e) => handleHeaderDrop(e, colIndex)}
                                            onDragOver={(e) => e.preventDefault()}
                                        >
                                            <div className="flex items-center justify-between">
                                                {header.label}
                                                <img src={Icon} alt="sort" className="w-4 h-4" />
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rawData.slice(1).map((row, i) => (
                                    <tr key={i} className="bg-[#eaeae8]">
                                        {row.map((cell, j) => (
                                            <td key={j} className="px-4 py-2 border-r-2 border-[#D9D9D9] text-sm">{cell}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            <div className="flex justify-end gap-2 p-4 mt-4">
                <button
                    className="px-4 py-2 text-sm font-semibold bg-[#f5f5f5] border border-[#B3B3B3] rounded-lg hover:bg-gray-200"
                    onClick={onClose}
                >
                    Cancel
                </button>
                {rawData.length > 0 && (
                    <button
                        className="px-4 py-2 text-sm font-semibold bg-black text-white rounded-lg hover:bg-gray-900"
                        onClick={handleFreight}
                    >
                        Process Shipments
                    </button>
                )}
            </div>
        </ModalBox>
    );
};

export default ImportModal;
