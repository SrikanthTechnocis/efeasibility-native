import { StatusBar } from "expo-status-bar";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { authStore } from "../store/authStore";
import { useEffect, useState } from "react";
import { universalStore } from "../store/universalStore";
import AllQuestionnairesTable from "./ui/table";
import Loader from "./ui/Loader";

const DashboardCompnent = () => {
  const [user, setUser] = useState<any>(null);
  const [allQuestionnairess, setAllQuestionnairess] = useState<any>(null);
  const { getUserFromLocalStorage } = authStore();
  const { fetchQuestionnaires } = universalStore();
  let loading = false;

  const getDatas = () => {
    loading = true;
    getUserFromLocalStorage().then((res: any) => {
      if (res) {
        let user = JSON.parse(res);
        setUser(user);
        getAllQuestionnaires(user["id"]);
      }
    });
  };

  // Get All Questionnaires
  const getAllQuestionnaires = (userId: any) => {
    console.log("All Questionnaire Called");
    fetchQuestionnaires(userId)
      .then((questionnaires: any) => {
        if (questionnaires) {
          setAllQuestionnairess(questionnaires.data);
          loading = false;
        } else {
          loading = false;
        }
      })
      .catch((error: any) => {
        console.error("Error fetching All Questions", error);
      });
  };

  useEffect(() => {
    getDatas();
  }, []);

  if (!allQuestionnairess) {
    console.log("No More");
    return (
      <View className="flex-1  bg-[#e2ded7] p-2">
        <Text className="font-bold text-2xl">All Questionnaires</Text>
        <Loader />
        <StatusBar style="auto" />
      </View>
    );
  }
  return (
    <>
      <View className="flex-1">
        <ScrollView>
          <View className="flex-1 p-2">
            <Text className="font-bold text-2xl">All Questionnaires</Text>
            <View className="p-2">
              {allQuestionnairess && (
                <View>
                  <AllQuestionnairesTable data={allQuestionnairess} />
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        <StatusBar style="auto" />
      </View>
    </>
  );
};

export default DashboardCompnent;
