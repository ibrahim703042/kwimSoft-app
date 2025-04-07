import { CalendarFold, CalendarClock, ArrowDownUp, Plus, Trash2, FilePenLine } from "lucide-react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Swal from 'sweetalert2';
import { API_ROUTE } from '../../../config';
import { Button } from "../../components/ui/button";
import { useState } from "react";
import { MenuItem, Select } from "@mui/material";

interface Bus {
  modele?: string;
  registrationNumber?: string;
}

interface Trip {
  departureStation?: { city?: string };
  arrivalStation?: { city?: string };
  duration?: number;
}

interface Company {
  name?: string;
}

interface Item {
  _id?: number;
  departureDate?: string;
  arrivalDate?: string;
  company?: Company;
  bus?: Bus;
  trip?: Trip;
  totalSeats?: number;
  isActive?: boolean;
}

interface HoraireProps {
  items: Item;
}

const postData = async (id: number) => {
  const response = await axios.patch(`${API_ROUTE}/timetables/toggle-active/${id}`);
  return response.data;
};

const StatusData = async (id: number, selectedStatus) => {
  const response = await axios.patch(`${API_ROUTE}/timetables/change-status/${id}?status=${selectedStatus}`);
  return response.data;
};

const TimeTableStatus = [
  { value: "SCHEDULED", label: "SCHEDULED" },
  { value: "DELAYED", label: "DELAYED" },
  { value: "CANCELLED", label: "CANCELLED" },
  { value: "ON_TIME", label: "ON_TIME" },
  { value: "ARRIVED", label: "ARRIVED" },
  { value: "DEPARTED", label: "DEPARTED" },
  { value: "UNKNOWN", label: "UNKNOWN" },
  { value: "PLANNED", label: "PLANNED" },
  { value: "UPDATED", label: "UPDATED" },
  { value: "SUSPENDED", label: "SUSPENDED" },
  { value: "EXPIRED", label: "EXPIRED" },
];

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    SCHEDULED: "bg-blue-500 text-blue-500",
    DELAYED: "bg-yellow-500 text-yellow-500",
    CANCELLED: "bg-red-500 text-red-500",
    ON_TIME: "bg-green-500 text-green-500",
    ARRIVED: "bg-purple-500 text-purple-500",
    DEPARTED: "bg-indigo-500 text-indigo-500",
    UNKNOWN: "bg-gray-500 text-gray-500",
    PLANNED: "bg-blue-400 text-blue-400",
    UPDATED: "bg-orange-500 text-orange-500",
    SUSPENDED: "bg-pink-500 text-pink-500",
    EXPIRED: "bg-gray-400 text-gray-400",
  };
  return colors[status] || "bg-black text-black";
};

export default function HoraireComponent({ items }: HoraireProps) {

  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState(items?.status);

  console.log("selectedStatusselectedStatusselectedStatus", selectedStatus);


  const updateStatus = async (newStatus: string) => {
    const response = await axios.patch(`${API_ROUTE}/timetables/update-status/${items._id}`, {
      status: newStatus,
    });
    return response.data;
  };

  const handleSuccess = () => {
    Swal.fire({
      title: "Succès!",
      text: "Le chauffeur a été enregistré avec succès.",
      icon: "success",
      confirmButtonText: "OK",
      customClass: { popup: "swal-custom" },
    });
    queryClient.invalidateQueries(["horaire"]);
  };

  // Fonction générique pour gérer l'erreur
  const handleError = () => {
    Swal.fire({
      title: "Erreur!",
      text: "Une erreur est survenue. Veuillez réessayer.",
      icon: "error",
      confirmButtonText: "OK",
    });
  };

  const mutation = useMutation({
    mutationFn: postData,
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const mutationStatut = useMutation({
    mutationFn: (newStatus: string) => StatusData(items._id, newStatus),
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const handleChangeStatus = async (event: any) => {
    const newStatus = event.target.value;
    setSelectedStatus(newStatus);
    await mutationStatut.mutateAsync(newStatus);
  };

  const handleClick = async (id?: number) => {
    if (!id) return;
    console.log("ID envoyé :", id);
    try {
      await mutation.mutateAsync(id);
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
    }
  };

  return (
    <div className='mt-3'>
      <div className="bg-[#EFF3F6] rounded-md pb-3">
        <div className="p-2 flex justify-between">
          {/* <div>
            <p className="text-[0.7rem] font-medium">#VYG - {items?._id}</p>
          </div> */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <CalendarFold className="text-[#191c21bd]" size="15" />
              <p className="text-[0.7rem] font-medium text-[#8c1313]">
                Départ {items?.departureDate && new Date(items.departureDate).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <CalendarFold className="text-[#191c21bd]" size="15" />
              <p className="text-[0.7rem] font-medium text-[#1f6b2b]">
                Arrivé {items?.arrivalDate && new Date(items?.arrivalDate).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 border border-[#191C21] py-1 px-3 rounded-md">
            <p className="text-[0.7rem] text-[#1f6b2b]  font-semibold py-1">
              {items?.price?.currency?.symbol} {items?.price?.amount?.toLocaleString('fr-FR')}
            </p>
          </div>
        </div>
        <hr className="mb-1" />
        <div className="px-2 flex items-center gap-7">
          <div>
            <p className="text-[#d37f19] font-medium text-[0.8rem]">


            </p>
          </div>
          <div className="flex items-center gap-8">
            <p className="font-medium text-[0.8rem] text-[#939393]">
              Modèle <span className="font-normal">{items?.bus?.modele}</span>
            </p>
            <p className="font-medium text-[0.8rem] text-[#939393]">
              Numéro d'immatriculation <span className="font-normal">{items?.bus?.registrationNumber}</span>
            </p>
            <p className="font-medium text-[0.8rem] text-[#939393]">
              Matricule <span className="font-normal">N-9850483829</span>
            </p>
          </div>
        </div>

        <div className="bg-[#ffffff] flex items-center justify-between mx-2 my-2 rounded-md border px-2 py-3">
          <div className="flex items-center gap-5">
            <div>
              <img src={items?.buses[0]?.image} alt="bus compagnies" width="60px" />
            </div>
            <div>
              <p className="text-[0.8rem] font-medium leading-1 whitespace-nowrap text-center">
                {items?.trip?.departureStation?.city}
              </p>
              <div className="flex justify-center">
                <ArrowDownUp size={12} />
              </div>
              <p className="text-[0.8rem] font-medium leading-1 text-center">
                {items?.trip?.arrivalStation?.city}
              </p>

            </div>
            <div className="ml-6 mr-6">
              <p className="text-[0.7rem] font-medium text-[#939393]">
                Personnel à bord : {items?.totalSeats}
              </p>
            </div>
            <div>

            </div>
          </div>

          <div className="px-2">

            <div className="flex items-center gap-1 cursor-pointer">
              {/* Sélecteur de statut */}
              <Select
                value={selectedStatus}
                onChange={handleChangeStatus}
                size="small"
                sx={{ fontSize: "0.7rem", fontWeight: "500", minWidth: 100 }}
              >
                {TimeTableStatus.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </div>

            <div className='flex justify-end'>
              <button onClick={() => handleClick(items?._id)}
                className="border cursor-pointer mt-2 px-3 py-2 p-1 rounded-md flex justify-center items-center gap-1">

                <p className={`text-[0.7rem] font-semibold text-center ${items?.isActive === !true ? "text-green-600" : "text-[#9c2b2b]"} `}>
                  {items?.isActive === !true ? "Activer" : "Désactiver"}
                </p>
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-2">
          <Button variant="outline" size="icon">
            <FilePenLine color="green" />
          </Button>
          <Button variant="outline" size="icon">
            <Trash2 color="red" />
          </Button>
        </div>
      </div>

    </div>
  )
}
