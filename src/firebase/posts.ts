// useLayoutEffect(() => {
//   const unsubscribe = onSnapshot(
//     query(collection(firestore, 'posts'), orderBy('createdAt', 'asc')),
//     (snopshot) => {
//       const document: DocumentData[] = [];

//       snopshot.forEach((doc) => {
//         document.push(doc.data());
//       });

//       setPrepare(document as Message[]);
//       setRenderData(document as Message[]);
//     }
//   );

//   return () => unsubscribe();
// }, []);
