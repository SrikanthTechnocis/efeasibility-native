import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View, Text } from "react-native";
import QuestionnaireDetails from "../../../components/QuestionnaireDetails";

const QuestionnaireDetailPage = () => {
  const { questionnaireId, reportId, resultId, siteId } =
    useLocalSearchParams();
  return (
    <View>
      <QuestionnaireDetails
        questionnaireId={questionnaireId}
        reportId={reportId}
        resultId={resultId}
        siteId={siteId}
      />
    </View>
  );
};

export default QuestionnaireDetailPage;
