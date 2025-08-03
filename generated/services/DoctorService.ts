/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_upload_audio_doctors_upload_audio_post } from "../models/Body_upload_audio_doctors_upload_audio_post";
import type { DoctorCreate } from "../models/DoctorCreate";
import type { DoctorResponse } from "../models/DoctorResponse";
import type { VisitResponse } from "../models/VisitResponse";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class DoctorService {
  /**
   * Register Doctor
   * @returns DoctorResponse Successful Response
   * @throws ApiError
   */
  public static registerDoctorDoctorsRegisterPost({
    requestBody,
  }: {
    requestBody: DoctorCreate;
  }): CancelablePromise<DoctorResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/doctors/register",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Doctor
   * @returns DoctorResponse Successful Response
   * @throws ApiError
   */
  public static getDoctorDoctorsDoctorIdGet({
    doctorId,
  }: {
    /**
     * The ID of the doctor to get
     */
    doctorId: string;
  }): CancelablePromise<DoctorResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/doctors/{doctor_id}",
      path: {
        doctor_id: doctorId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Update Doctor
   * @returns DoctorResponse Successful Response
   * @throws ApiError
   */
  public static updateDoctorDoctorsDoctorIdPut({
    doctorId,
    firstName,
    lastName,
    specialty,
    email,
  }: {
    /**
     * The ID of the doctor to update
     */
    doctorId: string;
    firstName?: string;
    lastName?: string;
    specialty?: string;
    email?: string;
  }): CancelablePromise<DoctorResponse> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/doctors/{doctor_id}",
      path: {
        doctor_id: doctorId,
      },
      query: {
        first_name: firstName,
        last_name: lastName,
        specialty: specialty,
        email: email,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Delete Doctor
   * @returns any Successful Response
   * @throws ApiError
   */
  public static deleteDoctorDoctorsDoctorIdDelete({
    doctorId,
  }: {
    /**
     * The ID of the doctor to delete
     */
    doctorId: string;
  }): CancelablePromise<Record<string, any>> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/doctors/{doctor_id}",
      path: {
        doctor_id: doctorId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Doctors
   * @returns DoctorResponse Successful Response
   * @throws ApiError
   */
  public static getDoctorsDoctorsGet({
    page,
    limit = 10,
  }: {
    page?: number;
    limit?: number;
  }): CancelablePromise<Array<DoctorResponse>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/doctors/",
      query: {
        page: page,
        limit: limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Profile
   * @returns DoctorResponse Successful Response
   * @throws ApiError
   */
  public static getProfileDoctorsProfileActiveGet(): CancelablePromise<DoctorResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/doctors/profile/active",
    });
  }
  /**
   * Upload Audio
   * @returns VisitResponse Successful Response
   * @throws ApiError
   */
  public static uploadAudioDoctorsUploadAudioPost(
    {
      formData,
    }: {
      formData: Body_upload_audio_doctors_upload_audio_post;
    },
    p0: { headers: { Authorization: string } }
  ): CancelablePromise<VisitResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/doctors/upload/audio",
      formData: formData,
      mediaType: "multipart/form-data",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Doctor
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getDoctorDoctorsVisitVisitIdGet({
    visitId,
  }: {
    /**
     * The ID of the visit to get
     */
    visitId: string;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/doctors/visit/{visit_id}",
      path: {
        visit_id: visitId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Doctors
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getDoctorsDoctorsVisitsAllGet({
    targetDate,
  }: {
    targetDate: string;
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/doctors/visits/all",
      query: {
        target_date: targetDate,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
