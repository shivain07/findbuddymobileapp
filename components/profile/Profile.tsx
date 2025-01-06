import { Avatar, Button, H4, SizableText, YStack } from 'tamagui';
import UpdateProfileDialog from './UpdateProfileDialog';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useUserStore } from '@/globalstore/userStore';
import { API_PATH } from '@/constants/Ui';
import Toast from 'react-native-toast-message';
import { useApiCall } from '@/helpers/axiosWrapper';
import userNoDp from "@/assets/images/userimg.png";

function Profile() {
    const { user } = useUserStore();
    const { apiCall } = useApiCall();

    const verifyUser = async () => {
        const response = await apiCall({
            url: API_PATH.user.sendmail,
            method: "POST",
            data: { userId: user?._id },
        });

        if (response) {
            Toast.show({
                type: "success",
                text1: "Verification mail sent.",
                text2: "Please check your inbox."
            });
        } 

    };
    return (<YStack alignSelf='center' margin="$2" gap="$2" >
        <Avatar circular size="$8">
            <Avatar.Image
                accessibilityLabel="Cam"
                src={user?.profileImgUrl||userNoDp}
            />
            <Avatar.Fallback backgroundColor="$blue10" />
        </Avatar>
        <H4>
            <AntDesign name="checkcircleo" size={20} color={user?.isVerified ? "green" : "gray"} style={{ padding: 4 }} />
            {user?.username}</H4>
        <SizableText>{user?.email}</SizableText>
        <UpdateProfileDialog userId={user?._id!} username={user?.username!}/>
        {!user?.isVerified && <Button theme={"green"} onPress={verifyUser}>{"Verify "}</Button>}
    </YStack>);
}

export default Profile;

