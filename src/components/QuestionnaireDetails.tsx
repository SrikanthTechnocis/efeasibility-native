import { View, Text, ScrollView, Button, Pressable, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { authStore } from "../store/authStore";
import { useRouter } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Loader from "./ui/Loader";
import { universalStore } from "../store/universalStore";
import { format } from "date-fns";
import { Vimeo } from "react-native-vimeo-iframe";
import RNFS from "react-native-fs";
interface QuestionnaireDetailsProps {
  questionnaireId: any;
  reportId: any;
  resultId: any;
  siteId: any;
}

const QuestionnaireDetails: React.FC<QuestionnaireDetailsProps> = ({
  questionnaireId,
  reportId,
  resultId,
  siteId,
}) => {
  const [user, setUser] = useState<any>();
  const [Loading, setLoading] = useState<boolean>(false);
  const [questionnaire, setQuestionnaire] = useState<any>();
  const { getUserFromLocalStorage } = authStore();
  const { setHeaderName, fetchQuestionnaireById, fetchSecureSignedUrl } =
    universalStore();
  const router = useRouter();

  const getLabel = (key: any, section: any) => {
    let results = section["resutls"];
    if (results && results.answers) {
      return results["answers"][key];
    }

    return "";
  };

  const initData = () => {
    setHeaderName("Questionnaire");
    getUserFromLocalStorage()
      .then((userData: any) => {
        if (userData) {
          let formattedUser: any = JSON.parse(userData);
          setUser(formattedUser);
          console.log("-Questinnaire-user", formattedUser);
          if (formattedUser) {
            getQuestionnaire(questionnaireId, resultId, siteId, formattedUser);
          }
        }
      })
      .catch((error: any) => {
        console.error("Error fetching user data", error);
      });
  };

  const getQuestionnaire = (
    questionnaireId: any,
    resultId: any,
    siteId: any,
    user: any
  ) => {
    console.log("Question By Id Called");
    fetchQuestionnaireById(
      questionnaireId,
      siteId,
      resultId,
      user["id"],
      user["profileId"]
    )
      .then((res: any) => {
        if (res) {
          setQuestionnaire(res.data);
          console.log("--Questionnaire:--");
        }
      })
      .catch((error: any) => {
        console.error("Error fetching question details", error);
      });
  };

  const fetchSecureUrl = (fileName: string, Url: string) => {
    setLoading(true);
    // fetch secureUrl
    let pathname = new URL(Url).pathname.replace(/^\/+/, "");
    fetchSecureSignedUrl({ fileUrl: pathname })
      .then(async (res: any) => {
        console.log("secureUrl:", res.data.url);

        // const localFile = `${RNFS.DocumentDirectoryPath}/${fileName}`;
        // console.log("localfile", localFile);
        // try {
        //   const result = await RNFS.downloadFile({
        //     fromUrl: res.data.url,
        //     toFile: localFile,
        //   }).promise;
        //   console.log("result", result);
        //   if (result.statusCode === 200) {
        //     Alert.alert("Download complete", `File saved to: ${localFile}`);
        //   } else {
        //     Alert.alert(
        //       "Download failed",
        //       "Something went wrong while downloading"
        //     );
        //   }
        // } catch (error) {
        //   Alert.alert("Error", "An error occurred during download");
        // } finally {
        //   setLoading(false);
        // }
      })
      .catch((error: any) => {
        Alert.alert("Error", "An error occurred while fetching secure URL");
        setLoading(false);
      });
  };

  useEffect(() => {
    initData();
  }, []);

  const getVimeoVideoId = (url: string): string | null => {
    const match = url.match(/vimeo\.com\/(\d+)/);
    console.log("vimeoId", match ? match[1] : null);
    return match ? match[1].toString() : null;
  };

  const videoCallbacks = {
    timeupdate: (data: any) => console.log("timeupdate: ", data),
    play: (data: any) => console.log("play: ", data),
    pause: (data: any) => console.log("pause: ", data),
    fullscreenchange: (data: any) => console.log("fullscreenchange: ", data),
    ended: (data: any) => console.log("ended: ", data),
    controlschange: (data: any) => console.log("controlschange: ", data),
  };

  if (!user || !questionnaire) {
    return (
      <View className="flex-1 px-2 pt-3">
        <View className="flex flex-row items-center justify-end w-full">
          <Pressable
            className="mx-2 my-1 p-3 rounded bg-blue-600"
            onPress={() => {
              router.back();
            }}
          >
            <Text className="text-center text-white font-semibold">Back</Text>
          </Pressable>
        </View>
        <Loader />
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <>
      <View className="flex-1 w-[100vw]">
        <View className="flex flex-row items-center justify-end">
          <Pressable
            className="mx-2 my-1 p-3 rounded bg-blue-600"
            onPress={() => {
              router.back();
            }}
          >
            <Text className="text-center text-white font-semibold">Back</Text>
          </Pressable>
        </View>

        {/* Questionnaire Details */}
        <ScrollView className="flex-1 p-4 bg-light">
          <View className="flex-1 mb-2">
            <Vimeo
              videoId={getVimeoVideoId(questionnaire?.fileUrl) || ""}
              params={"api=1&autoplay=0"}
              handlers={videoCallbacks}
              style={{ width: "100%", height: 300 }}
            />
          </View>
          {/* <View className="flex-1 mb-2 shadow bg-white rounded-lg p-4 overflow-hidden">
            <ScrollView className="flex-1 p-4 bg-light max-h-[12rem]">
              {questionnaire.synopsisUrl ? (
                <Pressable
                  onPress={() =>
                    fetchSecureUrl(
                      questionnaire.synopsisName,
                      questionnaire.synopsisUrl
                    )
                  }
                >
                  <View
                    key={`pdf-${questionnaire.synopsisName}`}
                    className="flex flex-row items-center mb-4 overflow-x-hidden"
                  >
                    <FontAwesome6 name="file-pdf" size={24} color="red" />
                    <Text className="ml-2 text-lg text-wrap">
                      {questionnaire.synopsisName}
                    </Text>
                  </View>
                </Pressable>
              ) : (
                ""
              )}
              {questionnaire.document1Name ? (
                <View
                  key={`pdf-${questionnaire.document1Name}`}
                  className="flex flex-row items-center mb-4 overflow-x-hidden"
                >
                  <FontAwesome6 name="file-pdf" size={24} color="red" />
                  <Text className="ml-2 text-lg text-wrap">
                    {questionnaire.document1Name}
                  </Text>
                </View>
              ) : (
                ""
              )}
              {questionnaire.document2Name ? (
                <View
                  key={`pdf-${questionnaire.document2Name}`}
                  className="flex flex-row items-center mb-4 overflow-x-hidden"
                >
                  <FontAwesome6 name="file-pdf" size={24} color="red" />
                  <Text className="ml-2 text-lg text-wrap">
                    {questionnaire.document2Name}
                  </Text>
                </View>
              ) : (
                ""
              )}
              {questionnaire.document3Name ? (
                <View
                  key={`pdf-${questionnaire.document3Name}`}
                  className="flex flex-row items-center mb-4 overflow-x-hidden"
                >
                  <FontAwesome6 name="file-pdf" size={24} color="red" />
                  <Text className="ml-2 text-lg text-wrap">
                    {questionnaire.document3Name}
                  </Text>
                </View>
              ) : (
                ""
              )}
              {questionnaire.document4Name ? (
                <View
                  key={`pdf-${questionnaire.document4Name}`}
                  className="flex flex-row items-center mb-4 overflow-x-hidden"
                >
                  <FontAwesome6 name="file-pdf" size={24} color="red" />
                  <Text className="ml-2 text-lg text-wrap">
                    {questionnaire.document4Name}
                  </Text>
                </View>
              ) : (
                ""
              )}
            </ScrollView>
          </View> */}
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
              <View className="text-center max-w-screen-sm overflow-x-auo">
                <Text className="mb-4">{section.sectionInfo.instruction}</Text>
                {section.sectionInfo.fields.map(
                  (field: any, fieldIndex: any) => (
                    <View
                      key={`${field.key}-${fieldIndex}`}
                      className="flex-1 mb-2"
                    >
                      <Text className="font-bold mb-1 text-wrap">
                        {field.label}
                      </Text>
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
                                    className="flex-1 my-2"
                                  >
                                    <Text className="font-bold mb-1 text-wrap max-w-[90vw]">
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
                                    className="flex-1 my-2"
                                  >
                                    <Text className="font-bold mb-1 text-wrap max-w-[90vw]">
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
