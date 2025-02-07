import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { authStore } from "../store/authStore";
import { useRouter } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Loader from "./ui/Loader";
import { universalStore } from "../store/universalStore";
import { format } from "date-fns";

const QuestionnaireDetails = ({
  questionnaireId,
  reportId,
  resultId,
  siteId,
}: {
  questionnaireId: any;
  reportId: any;
  resultId: any;
  siteId: any;
}) => {
  const [user, setUser] = useState<any>();
  const [questionnaire, setQuestionnaire] = useState<any>();
  const { getUserFromLocalStorage } = authStore();
  const { setHeaderName, fetchQuestionnaireById } = universalStore();
  const router = useRouter();

  const getLabel = (key: any, section: any) => {
    let results = section["resutls"];
    if (results && results.answers) {
      return results["answers"][key];
    }

    return "";
  };

  const initData = async () => {
    setHeaderName("Questionnaire");
    const userData = await getUserFromLocalStorage();
    setUser(JSON.parse(userData));

    fetchQuestionnaireById(
      questionnaireId,
      siteId,
      resultId,
      user["id"],
      user["profileId"]
    ).then((que: any) => {
      setQuestionnaire(que.data);
    });
  };

  useEffect(() => {
    initData();
  }, []);

  if (!user || !questionnaire) {
    return (
      <View className="flex-1 px-2 pt-3">
        <View className="flex flex-row items-center justify-end w-full">
          {/* <Text className="font-bold text-2xl">Report View </Text> */}
          <MaterialCommunityIcons
            name="backburger"
            size={26}
            color="black"
            onPress={() => {
              router.back();
            }}
          />
        </View>
        {/* <View className="mt-2 border border-black/50"></View> */}
        <Loader />
        <StatusBar style="auto" />
      </View>
    );
  }
  return (
    <>
      <View className="flex-1 w-[100vw]">
        <View className="flex flex-row items-center justify-end">
          {/* <Text className="font-bold text-2xl">Report View </Text> */}
          <MaterialCommunityIcons
            name="backburger"
            size={24}
            color="black"
            onPress={() => {
              router.back();
            }}
          />
        </View>
        <View className="mt-2 border border-black/50"></View>

        {/* Questionnaire Details */}
        <ScrollView className="flex-1 p-4">
          <View className="flex-1 mb-2"></View>
          <Text className="font-bold text-2xl mb-4">Questionnaire Details</Text>
          {questionnaire ? (
            <>
              <View className="mb-4">
                <View className="flex-1 flex-row items-center w-[100vw]">
                  <Text className="font-bold text-lg w-[50%] text-start">
                    Questionnaire Name:
                  </Text>
                  <Text className="ml-2 text-lg w-[50%] text-end">
                    {questionnaire.questionnaireName
                      ? questionnaire.questionnaireName
                      : ""}
                  </Text>
                </View>
                <View className="flex-1 flex-row items-center w-[100vw]">
                  <Text className="font-bold text-lg w-[50%] text-star">
                    Study:
                  </Text>
                  <Text className="ml-2 text-lg w-[50%] text-end">
                    {questionnaire.studyInfo
                      ? questionnaire.studyInfo?.study_acronym
                      : ""}
                  </Text>
                </View>
              </View>
              <View className="justify-between mb-4">
                <View className="flex-1 flex-row items-center w-[100vw]">
                  <Text className="font-bold text-lg w-[50%] text-start">
                    CDA Status:
                  </Text>
                  <Text className="ml-2 text-lg w-[50%] text-end">
                    {questionnaire.CDA_FLAG ? "PI Signed" : "PI UnSigned"}
                  </Text>
                </View>
                <View className="flex-1 flex-row items-center w-[100vw]">
                  <Text className="font-bold text-lg w-[50%] text-start">
                    Site:
                  </Text>
                  <Text className="ml-2 text-lg w-[50%] text-end">
                    {questionnaire.siteInfo
                      ? questionnaire.siteInfo?.site_name
                      : ""}
                  </Text>
                </View>
              </View>
              <View className="justify-between mb-4">
                <View className="flex-1 flex-row items-center w-[100vw]">
                  <Text className="font-bold text-lg w-[50%] text-start">
                    Contact name:
                  </Text>
                  <Text className="ml-2 text-lg w-[50%] text-end">
                    {questionnaire.contactName ? questionnaire.contactName : ""}
                  </Text>
                </View>
                <View className="flex-1 flex-row items-center w-[100vw]">
                  <Text className="font-bold text-lg w-[50%] text-start">
                    Contact No:
                  </Text>
                  <Text className="ml-2 text-lg w-[50%] text-end">
                    {questionnaire.contactNo ? questionnaire.contactNo : ""}
                  </Text>
                </View>
              </View>
              <View className="justify-between mb-4">
                <View className="flex-1 flex-row items-center w-[100vw]">
                  <Text className="font-bold text-lg w-[50%] text-start">
                    Contact email:
                  </Text>
                  <Text className="ml-2 text-lg w-[50%] text-end">
                    {questionnaire.contactEmail
                      ? questionnaire.contactEmail
                      : ""}
                  </Text>
                </View>
                <View className="flex-1 flex-row items-center w-[100vw]">
                  <Text className="font-bold text-lg w-[50%] text-start">
                    Contact Designation:
                  </Text>
                  <Text className="ml-2 text-lg w-[50%] text-end">
                    {questionnaire.contactDesignation
                      ? questionnaire.contactDesignation
                      : ""}
                  </Text>
                </View>
              </View>
              <View className="justify-between mb-4">
                <View className="flex-1 items-start">
                  <Text className="font-bold text-lg">Synopsis:</Text>
                  <Text className="ml-1 text-lg text-wrap">
                    {questionnaire.synopsis ? questionnaire.synopsis : ""}
                  </Text>
                </View>
              </View>
            </>
          ) : (
            ""
          )}
          {/* Secitons  */}
          <Text className="font-bold text-2xl mb-4">Sections</Text>

          {/* Loop Sections */}
          {questionnaire.sectionResults.map((section: any, index: any) => (
            <View
              key={`section-${section.sectionInfo.name}-${index}`}
              className="flex-1 w-[100vw] pt-2 mb-4"
            >
              <Text className="font-bold text-xl mb-2">
                {section.sectionInfo.name}
              </Text>
              <View className="text-center">
                <Text className="mb-4">{section.sectionInfo.instruction}</Text>
                {section.sectionInfo.fields.map(
                  (field: any, fieldIndex: any) => (
                    <View
                      key={`${field.key}-${fieldIndex}`}
                      className="flex-1 mb-2"
                    >
                      <Text className="font-bold mb-1">{field.label}</Text>
                      {/* Date Value */}
                      {field.controlType === "datepicker" ? (
                        <Text className="mx-2">
                          Answer:{" "}
                          {format(getLabel(field.key, section), "dd MMM yyyy")}
                        </Text>
                      ) : field.controlType === "yesno" ? (
                        <>
                          <Text className="mx-2">
                            Answer:{" "}
                            {getLabel(field.key, section) === "yes"
                              ? "Yes"
                              : "No"}
                          </Text>
                          {getLabel(field.key, section) === "yes" &&
                          field.childrens &&
                          field.childrens["yes"].length !== 0
                            ? field.childrens["yes"].map(
                                (yesQ: any, yesIndex: any) => (
                                  <View
                                    key={`${yesQ.label} - ${yesIndex}`}
                                    className="flex-1 my-2 ml-3"
                                  >
                                    <Text className="font-bold mb-1">
                                      {yesQ.label}
                                    </Text>
                                    {yesQ.controlType == "datepicker" ? (
                                      <Text className="mx-2">
                                        Answer:{" "}
                                        {format(
                                          getLabel(yesQ.key, section),
                                          "dd MMM yyyy"
                                        )}
                                      </Text>
                                    ) : (
                                      <Text className="mx-2">
                                        Answer: {getLabel(yesQ.key, section)}
                                      </Text>
                                    )}
                                  </View>
                                )
                              )
                            : null}
                          {getLabel(field.key, section) === "no" &&
                          field.childrens &&
                          field.childrens["no"].length !== 0
                            ? field.childrens["no"].map(
                                (noQ: any, noIndex: any) => (
                                  <View
                                    key={`${noQ.label} - ${noIndex}`}
                                    className="flex-1 my-2 ml-3"
                                  >
                                    <Text className="font-bold mb-1">
                                      {noQ.label}
                                    </Text>
                                    {noQ.controlType == "datepicker" ? (
                                      <Text className="mx-2">
                                        Answer:{" "}
                                        {format(
                                          getLabel(noQ.key, section),
                                          "dd MMM yyyy"
                                        )}
                                      </Text>
                                    ) : (
                                      <Text className="mx-2">
                                        Answer: {getLabel(noQ.key, section)}
                                      </Text>
                                    )}
                                  </View>
                                )
                              )
                            : null}
                        </>
                      ) : (
                        <Text className="mx-2">
                          Answer: {getLabel(field.key, section)}
                        </Text>
                      )}
                    </View>
                  )
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

export default QuestionnaireDetails;
